/** Outline SVG icons for the dashboard shell (ICON_GUIDELINES: flat, geometric, consistent stroke). */

export type DashboardIconName =
  | 'cash'
  | 'energy'
  | 'transport'
  | 'warehouse'
  | 'onsite'
  | 'employees'
  | 'success'
  | 'error'
  | 'info'
  | 'check';

type DashboardIconProps = {
  readonly name: DashboardIconName;
  readonly className?: string;
};

const STROKE = 1.75;

/** Renders a dashboard icon from the shared outline set. */
export function DashboardIcon({ name, className }: DashboardIconProps) {
  const shared = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: STROKE,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'cash':
      return (
        <svg {...shared}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M7 9h.01M17 15h.01" />
        </svg>
      );
    case 'energy':
      return (
        <svg {...shared}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case 'transport':
      return (
        <svg {...shared}>
          <path d="M3 7h11v8H3z" />
          <path d="M14 10h4l3 3v2h-7V10z" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
    case 'warehouse':
      return (
        <svg {...shared}>
          <path d="M4 10 12 4l8 6" />
          <path d="M6 10v9h12v-9" />
          <path d="M10 19v-5h4v5" />
        </svg>
      );
    case 'onsite':
      return (
        <svg {...shared}>
          <path d="M4 20V8l8-4 8 4v12" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case 'employees':
      return (
        <svg {...shared}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M15 20c.5-2 1.8-3.5 4-3.5" />
        </svg>
      );
    case 'success':
    case 'check':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );
    case 'error':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5" />
          <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'info':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10v6" />
          <circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}
