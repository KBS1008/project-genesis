import { ICON_TO_STATUS, STATUS_ICON } from './constants.js';
import type { BacklogEntry, VisualAssetActivityEntry, VisualAssetStatus } from './types.js';

const BACKLOG_LINE_RE =
  /^([☐◐👀☑🚀])\s+([A-Z]{2,5}-\d{3}_[^\s]+\.(?:png|jpe?g|webp|svg))$/i;

const ASSET_ID_RE = /^([A-Z]{2,5}-\d{3})_/i;

/** Extract asset ID (e.g. MM-001) from a backlog filename. */
export function extractAssetId(filename: string): string | null {
  const match = ASSET_ID_RE.exec(filename);
  return match?.[1]?.toUpperCase() ?? null;
}

/** Parse VISUAL_PRODUCTION_BACKLOG.md into structured entries. */
export function parseBacklog(content: string): BacklogEntry[] {
  const lines = content.split(/\r?\n/);
  const entries: BacklogEntry[] = [];
  let currentSprint = 'Unknown';
  let currentCategory = 'Unknown';

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (/^#+\s*Sprint\b/i.test(trimmed)) {
      currentSprint = trimmed.replace(/^#+\s*/, '');
      currentCategory = 'Unknown';
      continue;
    }

    if (trimmed.startsWith('## ') && !trimmed.startsWith('## Sprint')) {
      currentCategory = trimmed.replace(/^##\s*/, '');
      continue;
    }

    const match = BACKLOG_LINE_RE.exec(trimmed);
    if (match === null) {
      continue;
    }

    const icon = match[1] ?? '';
    const backlogFilename = match[2] ?? '';
    const status = ICON_TO_STATUS[icon];
    const assetId = extractAssetId(backlogFilename);

    if (status === undefined || assetId === null) {
      continue;
    }

    entries.push({
      lineIndex: index,
      status,
      backlogFilename,
      assetId,
      sprint: currentSprint,
      category: currentCategory,
    });
  }

  return entries;
}

/** Replace the status icon on a single backlog line. */
export function updateBacklogLineStatus(
  content: string,
  backlogFilename: string,
  status: VisualAssetStatus,
): string {
  const lines = content.split(/\r?\n/);
  const icon = STATUS_ICON[status];
  const escaped = backlogFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lineRe = new RegExp(`^([☐◐👀☑🚀])\\s+${escaped}$`, 'i');

  let updated = false;
  const nextLines = lines.map((line) => {
    if (!updated && lineRe.test(line.trim())) {
      updated = true;
      return `${icon} ${backlogFilename}`;
    }
    return line;
  });

  if (!updated) {
    throw new Error(`Backlog entry not found for ${backlogFilename}`);
  }

  return nextLines.join('\n');
}

/** Map asset ID prefix to catalog ID (e.g. MM-001 → UI-MM-001). */
export function toCatalogId(assetId: string): string {
  return `UI-${assetId}`;
}

/** Update catalog status for an asset if a matching block exists. */
export function updateCatalogStatus(
  content: string,
  assetId: string,
  status: VisualAssetStatus,
): string {
  const catalogId = toCatalogId(assetId);
  const statusLabels: Record<VisualAssetStatus, string> = {
    planned: 'Planned',
    'in-production': 'In Production',
    'in-review': 'In Review',
    approved: 'Approved',
    integrated: 'Integrated',
  };
  const nextStatus = statusLabels[status];

  const idIndex = content.indexOf(catalogId);
  if (idIndex === -1) {
    return appendCatalogEntry(content, assetId, nextStatus);
  }

  const afterId = content.slice(idIndex);
  const statusBlockRe = /(Status\s*\n\s*)([^\n]+)/i;
  const match = statusBlockRe.exec(afterId);

  if (match === null) {
    return appendCatalogEntry(content, assetId, nextStatus);
  }

  const absoluteStart = idIndex + (match.index ?? 0) + (match[1]?.length ?? 0);
  const absoluteEnd = absoluteStart + (match[2]?.length ?? 0);

  return `${content.slice(0, absoluteStart)}${nextStatus}${content.slice(absoluteEnd)}`;
}

function appendCatalogEntry(content: string, assetId: string, status: string): string {
  const catalogId = toCatalogId(assetId);
  const block = [
    '',
    `### ${catalogId}`,
    '',
    'ID',
    '',
    catalogId,
    '',
    'Status',
    '',
    status,
    '',
    '_Auto-added by Visual Asset Manager._',
    '',
  ].join('\n');

  return `${content.trimEnd()}\n${block}`;
}

/** Parse recent changelog entries (newest first). */
export function parseChangelog(content: string, limit = 20): VisualAssetActivityEntry[] {
  const entries: VisualAssetActivityEntry[] = [];
  const blocks = content.split(/\n##\s+/).map((block) => block.trim()).filter(Boolean);

  for (const block of blocks.reverse()) {
    if (entries.length >= limit) {
      break;
    }

    const lines = block.split('\n');
    const header = lines[0] ?? '';
    const headerMatch = /^(\d{4}-\d{2}-\d{2})\s+—\s+([A-Z]{2,5}-\d{3})/.exec(header);
    if (headerMatch === null) {
      continue;
    }

    const fields: Record<string, string> = {
      date: headerMatch[1] ?? '',
      'asset id': headerMatch[2] ?? '',
    };

    for (const line of lines.slice(1)) {
      const bulletMatch = /^-\s+([^:]+):\s*(.+)$/.exec(line.trim());
      if (bulletMatch === null) {
        continue;
      }
      const key = bulletMatch[1]?.trim().toLowerCase() ?? '';
      let value = bulletMatch[2]?.trim() ?? '';
      if (value.startsWith('`') && value.endsWith('`')) {
        value = value.slice(1, -1);
      }
      fields[key] = value;
    }

    entries.push({
      date: fields.date,
      assetId: fields['asset id'],
      operation: fields.operation ?? 'import',
      assetFilename: fields.asset ?? '',
      status: fields.status ?? '',
      destination: fields.destination ?? '',
      revision: Number.parseInt(fields.revision ?? '0', 10) || 0,
      sha256: fields['sha-256'] ?? '',
    });
  }

  return entries;
}

/** Format a new changelog block. */
export function formatChangelogEntry(entry: {
  readonly date: string;
  readonly assetId: string;
  readonly operation: string;
  readonly assetFilename: string;
  readonly status: string;
  readonly destination: string;
  readonly revision: number;
  readonly sha256: string;
}): string {
  const dateLabel = entry.date.slice(0, 10);
  return [
    `## ${dateLabel} — ${entry.assetId}`,
    '',
    `- Asset: \`${entry.assetFilename}\``,
    `- Operation: ${entry.operation}`,
    `- Status: ${entry.status}`,
    `- Destination: \`${entry.destination}\``,
    `- Revision: ${entry.revision}`,
    `- SHA-256: \`${entry.sha256}\``,
  ].join('\n');
}
