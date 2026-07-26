'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  STATUS_LABEL,
  STATUS_OPTIONS,
  fetchVisualAssetActivity,
  fetchVisualAssets,
  importVisualAsset,
  validateVisualAssetUpload,
  type VisualAssetActivity,
  type VisualAssetBacklogItem,
  type VisualAssetImportPlan,
  type VisualAssetStatus,
} from '@/presentation/adapters/api/visual-assets-client';
import { Button } from '@/presentation/primitives/Button';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { LoadingState } from '@/presentation/primitives/LoadingState';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import './visual-assets-screen.css';

function matchesSearch(item: VisualAssetBacklogItem, search: string): boolean {
  if (search.trim().length === 0) {
    return true;
  }
  const needle = search.trim().toLowerCase();
  return (
    item.assetId.toLowerCase().includes(needle) ||
    item.backlogFilename.toLowerCase().includes(needle) ||
    item.category.toLowerCase().includes(needle) ||
    item.sprint.toLowerCase().includes(needle)
  );
}

/** Developer screen for importing and tracking visual production assets. */
export function VisualAssetsScreen() {
  const [items, setItems] = useState<readonly VisualAssetBacklogItem[]>([]);
  const [activity, setActivity] = useState<readonly VisualAssetActivity[]>([]);
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [status, setStatus] = useState<VisualAssetStatus>('in-review');
  const [sprintFilter, setSprintFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [plan, setPlan] = useState<VisualAssetImportPlan | null>(null);
  const [acceptWarnings, setAcceptWarnings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [backlog, recent] = await Promise.all([
        fetchVisualAssets(),
        fetchVisualAssetActivity(),
      ]);
      setItems(backlog);
      setActivity(recent);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load backlog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (file === null) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const selectedItem = useMemo(
    () => items.find((item) => item.backlogFilename === selectedFilename) ?? null,
    [items, selectedFilename],
  );

  const sprintOptions = useMemo(
    () => ['all', ...new Set(items.map((item) => item.sprint))],
    [items],
  );
  const categoryOptions = useMemo(
    () => ['all', ...new Set(items.map((item) => item.category))],
    [items],
  );

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (sprintFilter !== 'all' && item.sprint !== sprintFilter) {
          return false;
        }
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false;
        }
        if (categoryFilter !== 'all' && item.category !== categoryFilter) {
          return false;
        }
        return matchesSearch(item, search);
      }),
    [items, sprintFilter, statusFilter, categoryFilter, search],
  );

  const runValidation = useCallback(async () => {
    if (selectedItem === null || file === null) {
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await validateVisualAssetUpload({
        file,
        backlogFilename: selectedItem.backlogFilename,
        status,
        acceptWarnings,
      });
      setPlan(result);
    } catch (validationError) {
      setPlan(null);
      setError(validationError instanceof Error ? validationError.message : 'Validation failed.');
    } finally {
      setBusy(false);
    }
  }, [selectedItem, file, status, acceptWarnings]);

  useEffect(() => {
    if (selectedItem !== null && file !== null) {
      void runValidation();
    } else {
      setPlan(null);
    }
  }, [selectedItem, file, status, acceptWarnings, runValidation]);

  const handleImport = async () => {
    if (selectedItem === null || file === null) {
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await importVisualAsset({
        file,
        backlogFilename: selectedItem.backlogFilename,
        status,
        acceptWarnings,
      });
      setSuccess(
        `Imported ${result.plan.canonicalFilename} → ${result.plan.targetRelativePath}`,
      );
      setFile(null);
      setPlan(null);
      await loadData();
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Import failed.');
    } finally {
      setBusy(false);
    }
  };

  const onFileSelected = (nextFile: File | null) => {
    setFile(nextFile);
    setSuccess(null);
  };

  return (
    <div className="vam-page">
      <header className="vam-header">
        <h1>Visual Asset Manager</h1>
        <p>Developer tool for backlog imports, validation, and document updates.</p>
      </header>

      {loading ? <LoadingState label="Loading backlog..." /> : null}

      {!loading ? (
      <div className="vam-layout">
        <StatusBanner
          tone="info"
          message="This route is for development only. Assets are saved automatically; do not rename files or edit backlog paths manually."
        />

        {error !== null ? <StatusBanner tone="error" message={error} /> : null}
        {success !== null ? <StatusBanner tone="success" message={success} /> : null}

        <Card title="Filters">
          <div className="vam-filters">
            <label>
              Sprint
              <select value={sprintFilter} onChange={(event) => setSprintFilter(event.target.value)}>
                {sprintOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">all</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="vam-search">
              Search
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Asset ID, filename, sprint..."
              />
            </label>
          </div>
        </Card>

        <div className="vam-main-grid">
          <Card title={`Backlog (${filteredItems.length})`}>
            {filteredItems.length === 0 ? (
              <EmptyState title="No backlog items match the current filters." />
            ) : (
              <div className="vam-table-wrap">
                <table className="vam-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Asset ID</th>
                      <th>Filename</th>
                      <th>Sprint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr
                        key={item.backlogFilename}
                        className={
                          selectedFilename === item.backlogFilename ? 'vam-row-selected' : ''
                        }
                        onClick={() => {
                          setSelectedFilename(item.backlogFilename);
                          setStatus(item.status === 'planned' ? 'in-production' : item.status);
                        }}
                      >
                        <td>{STATUS_LABEL[item.status]}</td>
                        <td>{item.assetId}</td>
                        <td>{item.backlogFilename}</td>
                        <td>{item.sprint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Import">
            {selectedItem === null ? (
              <EmptyState title="Select a backlog item to begin." />
            ) : (
              <div className="vam-import-panel">
                <dl className="vam-details">
                  <div>
                    <dt>Asset ID</dt>
                    <dd>{selectedItem.assetId}</dd>
                  </div>
                  <div>
                    <dt>Backlog filename</dt>
                    <dd>{selectedItem.backlogFilename}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{selectedItem.category}</dd>
                  </div>
                </dl>

                <label>
                  Target status
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as VisualAssetStatus)}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div
                  className="vam-dropzone"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const dropped = event.dataTransfer.files[0] ?? null;
                    onFileSelected(dropped);
                  }}
                >
                  <p>Drag and drop an image here</p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(event) => onFileSelected(event.target.files?.[0] ?? null)}
                  />
                </div>

                {previewUrl !== null ? (
                  <img className="vam-preview" src={previewUrl} alt="Upload preview" />
                ) : null}

                {plan !== null ? (
                  <div className="vam-plan">
                    <p>
                      <strong>Resolved filename:</strong> {plan.canonicalFilename}
                    </p>
                    <p>
                      <strong>Destination:</strong> {plan.targetRelativePath}
                    </p>
                    <p>
                      <strong>Dimensions:</strong> {plan.width}×{plan.height}
                    </p>
                    <p>
                      <strong>Revision:</strong> {plan.revision}
                    </p>
                    {plan.warnings.length > 0 ? (
                      <div className="vam-warnings">
                        {plan.warnings.map((warning) => (
                          <p key={warning}>{warning}</p>
                        ))}
                        <label>
                          <input
                            type="checkbox"
                            checked={acceptWarnings}
                            onChange={(event) => setAcceptWarnings(event.target.checked)}
                          />
                          Override warnings
                        </label>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <Button
                  variant="primary"
                  disabled={busy || selectedItem === null || file === null || plan === null}
                  onClick={() => void handleImport()}
                >
                  Save asset
                </Button>
              </div>
            )}
          </Card>
        </div>

        <Card title="Recent activity">
          {activity.length === 0 ? (
            <EmptyState title="No imports recorded yet." />
          ) : (
            <ul className="vam-activity">
              {activity.map((entry) => (
                <li key={`${entry.date}-${entry.assetId}-${entry.assetFilename}`}>
                  <strong>{entry.date.slice(0, 10)}</strong> — {entry.assetId}: {entry.operation}{' '}
                  <code>{entry.assetFilename}</code> → <code>{entry.destination}</code>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      ) : null}
    </div>
  );
}
