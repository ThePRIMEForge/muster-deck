import { ArrowRight, ClipboardList, Coins, Radio, Trophy } from 'lucide-react';
import { foundationCopy, moduleSummaries } from '../../lib/foundationCopy';
import type { FoundationRouteId } from '../../lib/foundationTypes';

type PublicLandingProps = {
  onRouteChange: (route: FoundationRouteId) => void;
};

export function PublicLanding({ onRouteChange }: PublicLandingProps) {
  return (
    <section className="foundation-page landing-page">
      <div className="landing-hero">
        <p className="eyebrow">Star Citizen operations</p>
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
        <article>
          <Radio size={22} />
          <h2>{moduleSummaries.rallyPoint.title}</h2>
          <p>{moduleSummaries.rallyPoint.description}</p>
        </article>
        <article>
          <ClipboardList size={22} />
          <h2>{moduleSummaries.fleetCommand.title}</h2>
          <p>{moduleSummaries.fleetCommand.description}</p>
        </article>
        <article>
          <Coins size={22} />
          <h2>{moduleSummaries.spoils.title}</h2>
          <p>{moduleSummaries.spoils.description}</p>
        </article>
        <article>
          <Trophy size={22} />
          <h2>{moduleSummaries.provingGround.title}</h2>
          <p>{moduleSummaries.provingGround.description}</p>
        </article>
      </div>
    </section>
  );
}
