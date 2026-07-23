/** Primary workspace screens defined in M9 UI information architecture. */
export const PRIMARY_SCREEN_IDS = [
  'world',
  'company',
  'markets',
  'production',
  'buildings',
  'research',
  'transport',
  'finance',
  'reports',
] as const;

export type PrimaryScreenId = (typeof PRIMARY_SCREEN_IDS)[number];

export type PrimaryScreenDefinition = {
  readonly id: PrimaryScreenId;
  readonly label: string;
  readonly description: string;
};

export const PRIMARY_SCREENS: readonly PrimaryScreenDefinition[] = [
  {
    id: 'world',
    label: 'Welt',
    description: 'Regionen, Karten und globale Übersicht.',
  },
  {
    id: 'company',
    label: 'Unternehmen',
    description: 'Unternehmens-Dashboard und KPIs.',
  },
  {
    id: 'markets',
    label: 'Märkte',
    description: 'Preise, Angebot und Nachfrage.',
  },
  {
    id: 'production',
    label: 'Produktion',
    description: 'Laufende Jobs und Rezepte.',
  },
  {
    id: 'buildings',
    label: 'Gebäude',
    description: 'Standorte, Bau und Kapazität.',
  },
  {
    id: 'research',
    label: 'Forschung',
    description: 'Technologien und Fortschritt.',
  },
  {
    id: 'transport',
    label: 'Transport',
    description: 'Routen und Lieferketten.',
  },
  {
    id: 'finance',
    label: 'Finanzen',
    description: 'Cashflow, Steuern und Verträge.',
  },
  {
    id: 'reports',
    label: 'Berichte',
    description: 'Historie, Trends und Auswertungen.',
  },
];

export function isPrimaryScreenId(value: string): value is PrimaryScreenId {
  return (PRIMARY_SCREEN_IDS as readonly string[]).includes(value);
}

export function getPrimaryScreenDefinition(
  screenId: PrimaryScreenId,
): PrimaryScreenDefinition {
  const screen = PRIMARY_SCREENS.find((entry) => entry.id === screenId);
  return screen ?? PRIMARY_SCREENS[1]!;
}
