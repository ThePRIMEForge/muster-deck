import { ArrowRight, ClipboardList, Coins, Radio, Trophy, X } from 'lucide-react';
import { useState } from 'react';
import { foundationCopy, moduleSummaries } from '../../lib/foundationCopy';
import type { FoundationRouteId } from '../../lib/foundationTypes';

type PublicLandingProps = {
  onRouteChange: (route: FoundationRouteId) => void;
};

const pillarCards = [
  {
    id: 'rallyPoint',
    icon: Radio,
    visualClassName: 'pillar-visual-rally',
  },
  {
    id: 'fleetCommand',
    icon: ClipboardList,
    visualClassName: 'pillar-visual-fleet',
  },
  {
    id: 'spoils',
    icon: Coins,
    visualClassName: 'pillar-visual-spoils',
  },
  {
    id: 'provingGround',
    icon: Trophy,
    visualClassName: 'pillar-visual-ground',
  },
] as const;

type PillarId = (typeof pillarCards)[number]['id'];

export function PublicLanding({ onRouteChange }: PublicLandingProps) {
  const [selectedPillar, setSelectedPillar] = useState<PillarId | null>(null);
  const selectedPillarSummary = selectedPillar ? moduleSummaries[selectedPillar] : null;

  return (
    <section className="foundation-page landing-page">
      <div className="landing-hero">
        <p className="eyebrow">SC Operations</p>
        <h1>{foundationCopy.landing.heroTitle}</h1>
        <p>{foundationCopy.landing.heroSubtitle}</p>
        <div className="landing-actions">
          <button className="foundation-primary" onClick={() => onRouteChange('signup')} type="button">
            {foundationCopy.landing.primaryCta}
            <ArrowRight size={17} />
          </button>
          <button className="foundation-secondary" onClick={() => onRouteChange('rally-browse')} type="button">
            {foundationCopy.landing.secondaryCta}
          </button>
        </div>
      </div>

      <div className="pillar-grid">
        {pillarCards.map(({ id, icon: Icon, visualClassName }) => {
          const summary = moduleSummaries[id];

          return (
            <button
              aria-haspopup="dialog"
              className="foundation-module-card foundation-module-action"
              key={id}
              onClick={() => setSelectedPillar(id)}
              type="button"
            >
              <div className={`pillar-card-visual ${visualClassName}`} aria-hidden="true">
                <span className="pillar-waypoint pillar-waypoint-one" />
                <span className="pillar-waypoint pillar-waypoint-two" />
                <span className="pillar-waypoint pillar-waypoint-three" />
              </div>
              <span className="foundation-module-icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <h2>{summary.title}</h2>
              <p>{summary.description}</p>
              <span className="pillar-access-note">{summary.publicAccess}</span>
            </button>
          );
        })}
      </div>

      {selectedPillarSummary && (
        <div className="pillar-modal-backdrop" onClick={() => setSelectedPillar(null)}>
          <section
            aria-labelledby="pillar-modal-title"
            aria-modal="true"
            className="pillar-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Close pillar details"
              className="pillar-modal-close"
              onClick={() => setSelectedPillar(null)}
              type="button"
            >
              <X size={18} />
            </button>
            <p className="eyebrow">Pillar Brief</p>
            <h2 id="pillar-modal-title">{selectedPillarSummary.title}</h2>
            <p>{selectedPillarSummary.detail}</p>
            <strong>{selectedPillarSummary.publicAccess}</strong>
          </section>
        </div>
      )}
    </section>
  );
}
