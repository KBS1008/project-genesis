export type MenuSettings = {
  readonly menuAnimationsEnabled: boolean;
};

const STORAGE_KEY = 'pg.menu.settings';

const DEFAULT_SETTINGS: MenuSettings = Object.freeze({
  menuAnimationsEnabled: true,
});

function isMenuSettings(value: unknown): value is MenuSettings {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return typeof (value as MenuSettings).menuAnimationsEnabled === 'boolean';
}

/** Loads persisted menu settings from local storage. */
export function loadMenuSettings(): MenuSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return DEFAULT_SETTINGS;
    }

    const parsed: unknown = JSON.parse(raw);
    return isMenuSettings(parsed) ? parsed : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Persists menu settings to local storage. */
export function saveMenuSettings(settings: MenuSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/** Patches menu settings and persists the result. */
export function patchMenuSettings(patch: Partial<MenuSettings>): MenuSettings {
  const next = Object.freeze({
    ...loadMenuSettings(),
    ...patch,
  });
  saveMenuSettings(next);
  return next;
}
