'use client';

/** MM-006 Splash screen shown during application boot. */
export function SplashScreen() {
  return (
    <div className="pg-menu-splash" role="status" aria-live="polite" aria-label="Project Genesis wird geladen">
      <div className="pg-menu-splash-content pg-menu-animate-in">
        <p className="pg-menu-splash-eyebrow">Project Genesis</p>
        <h1>Wirtschaftssimulation</h1>
        <p className="pg-menu-splash-tagline">Deterministische Industrie- und Wirtschaftswelt</p>
      </div>
    </div>
  );
}
