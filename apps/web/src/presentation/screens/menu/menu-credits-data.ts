export type MenuCreditEntry = {
  readonly role: string;
  readonly name: string;
};

export type MenuCreditsViewData = {
  readonly projectTitle: string;
  readonly entries: readonly MenuCreditEntry[];
  readonly technologyNote: string;
};

/** Runtime credits view-data for the main menu credits screen. */
export const MENU_CREDITS_VIEW_DATA: MenuCreditsViewData = Object.freeze({
  projectTitle: 'Project Genesis',
  entries: Object.freeze([
    { role: 'Simulation & Architecture', name: 'Project Genesis Team' },
    { role: 'Presentation Layer', name: 'Project Genesis Team' },
    { role: 'Visual Production', name: 'Project Genesis Team' },
  ]),
  technologyNote: 'Gebaut mit Next.js, React und TypeScript.',
});
