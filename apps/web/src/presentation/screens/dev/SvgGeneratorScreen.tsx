'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchSvgBacklog,
  fetchSvgGeneratorActivity,
  fetchSvgTemplates,
  generateSvg,
  previewSvg,
  suggestSvgTemplate,
  type SvgBacklogItem,
  type SvgGenerationResult,
  type SvgTemplateDefinition,
} from '@/presentation/adapters/api/svg-generator-client';
import { Button } from '@/presentation/primitives/Button';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { LoadingState } from '@/presentation/primitives/LoadingState';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import './svg-generator-screen.css';

/** Developer screen for generating production SVG assets from templates. */
export function SvgGeneratorScreen() {
  const [templates, setTemplates] = useState<readonly SvgTemplateDefinition[]>([]);
  const [backlog, setBacklog] = useState<readonly SvgBacklogItem[]>([]);
  const [activity, setActivity] = useState<readonly unknown[]>([]);
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState('chart-library');
  const [title, setTitle] = useState('Project Genesis SVG Reference');
  const [subtitle, setSubtitle] = useState('');
  const [width, setWidth] = useState(1600);
  const [height, setHeight] = useState(900);
  const [status, setStatus] = useState<'in-review' | 'approved' | 'in-production'>('in-review');
  const [acceptWarnings, setAcceptWarnings] = useState(false);
  const [preview, setPreview] = useState<SvgGenerationResult | null>(null);
  const [sourcePreview, setSourcePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedItem = useMemo(
    () => backlog.find((item) => item.backlogFilename === selectedFilename) ?? null,
    [backlog, selectedFilename],
  );

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === templateId) ?? null,
    [templates, templateId],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [templateList, backlogItems, recent] = await Promise.all([
        fetchSvgTemplates(),
        fetchSvgBacklog(),
        fetchSvgGeneratorActivity(),
      ]);
      setTemplates(templateList);
      setBacklog(backlogItems);
      setActivity(recent);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load SVG generator.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const buildRequest = useCallback(() => {
    if (selectedItem === null) {
      return null;
    }
    return {
      assetId: selectedItem.assetId,
      backlogFilename: selectedItem.backlogFilename,
      templateId,
      title,
      subtitle: subtitle.length > 0 ? subtitle : undefined,
      width,
      height,
      content: selectedTemplate?.defaultContent ?? {},
      status,
      acceptWarnings,
    };
  }, [selectedItem, templateId, title, subtitle, width, height, selectedTemplate, status, acceptWarnings]);

  const runPreview = useCallback(async () => {
    const request = buildRequest();
    if (request === null) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await previewSvg(request);
      setPreview(result);
      setSourcePreview(result.svg);
    } catch (previewError) {
      setPreview(null);
      setSourcePreview('');
      setError(previewError instanceof Error ? previewError.message : 'Preview failed.');
    } finally {
      setBusy(false);
    }
  }, [buildRequest]);

  useEffect(() => {
    const request = buildRequest();
    if (request === null) {
      setPreview(null);
      setSourcePreview('');
      return undefined;
    }
    const timer = window.setTimeout(() => {
      void runPreview();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [buildRequest, runPreview]);

  const handleSelectAsset = async (item: SvgBacklogItem) => {
    setSelectedFilename(item.backlogFilename);
    setTitle(item.backlogFilename.replace(/\.svg$/i, '').replace(/_/g, ' '));
    try {
      const suggested = await suggestSvgTemplate(item.assetId);
      setTemplateId(suggested);
      const template = templates.find((entry) => entry.id === suggested);
      if (template !== undefined) {
        setWidth(template.defaultWidth);
        setHeight(template.defaultHeight);
      }
    } catch {
      // Keep current template selection.
    }
  };

  const handleGenerate = async () => {
    const request = buildRequest();
    if (request === null) {
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await generateSvg(request);
      setSuccess(`Saved ${result.generation.filename} → ${result.generation.targetPath}`);
      await loadData();
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleExport = () => {
    if (preview === null) {
      return;
    }
    const blob = new Blob([preview.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = preview.filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="svg-gen-page">
      <header className="svg-gen-header">
        <h1>SVG Generator</h1>
        <p>Generate deterministic, accessible SVG assets and save them through the Visual Asset Manager.</p>
      </header>

      {loading ? <LoadingState label="Loading SVG generator..." /> : null}

      {!loading ? (
        <div className="svg-gen-layout">
          <StatusBanner tone="info" message="Developer-only tool. Paths, revisions, and document updates are resolved server-side." />
          {error !== null ? <StatusBanner tone="error" message={error} /> : null}
          {success !== null ? <StatusBanner tone="success" message={success} /> : null}

          <div className="svg-gen-grid">
            <Card title={`SVG Backlog (${backlog.length})`}>
              {backlog.length === 0 ? (
                <EmptyState title="No SVG backlog items found." />
              ) : (
                <ul className="svg-gen-list">
                  {backlog.map((item) => (
                    <li key={item.backlogFilename}>
                      <button
                        type="button"
                        className={selectedFilename === item.backlogFilename ? 'is-selected' : ''}
                        onClick={() => void handleSelectAsset(item)}
                      >
                        <strong>{item.assetId}</strong> — {item.backlogFilename}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Configuration">
              {selectedItem === null ? (
                <EmptyState title="Select an SVG backlog asset." />
              ) : (
                <div className="svg-gen-form">
                  <label>
                    Template
                    <select value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Title
                    <input value={title} onChange={(event) => setTitle(event.target.value)} />
                  </label>
                  <label>
                    Subtitle
                    <input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} />
                  </label>
                  <div className="svg-gen-dimensions">
                    <label>
                      Width
                      <input
                        type="number"
                        value={width}
                        onChange={(event) => setWidth(Number(event.target.value))}
                      />
                    </label>
                    <label>
                      Height
                      <input
                        type="number"
                        value={height}
                        onChange={(event) => setHeight(Number(event.target.value))}
                      />
                    </label>
                  </div>
                  <label>
                    Status
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value as typeof status)}
                    >
                      <option value="in-production">In Production</option>
                      <option value="in-review">In Review</option>
                      <option value="approved">Approved</option>
                    </select>
                  </label>
                  {preview !== null ? (
                    <div className="svg-gen-plan">
                      <p>
                        <strong>Filename:</strong> {preview.filename}
                      </p>
                      <p>
                        <strong>Destination:</strong> {preview.targetPath}
                      </p>
                      {preview.warnings.length > 0 ? (
                        <label>
                          <input
                            type="checkbox"
                            checked={acceptWarnings}
                            onChange={(event) => setAcceptWarnings(event.target.checked)}
                          />
                          Override warnings
                        </label>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="svg-gen-actions">
                    <Button variant="secondary" disabled={preview === null} onClick={handleExport}>
                      Export SVG
                    </Button>
                    <Button
                      variant="primary"
                      disabled={busy || preview === null}
                      onClick={() => void handleGenerate()}
                    >
                      Save asset
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <Card title="Live Preview">
            {preview === null ? (
              <EmptyState title="Preview will appear after configuration." />
            ) : (
              <div
                className="svg-gen-preview"
                dangerouslySetInnerHTML={{ __html: preview.svg }}
              />
            )}
          </Card>

          <Card title="SVG Source (read-only)">
            <pre className="svg-gen-source">{sourcePreview}</pre>
          </Card>

          <Card title="Recent activity">
            {activity.length === 0 ? (
              <EmptyState title="No generator activity yet." />
            ) : (
              <pre className="svg-gen-source">{JSON.stringify(activity, null, 2)}</pre>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
