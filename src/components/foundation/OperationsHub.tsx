import { ClipboardList, Coins, Radio, Trophy } from 'lucide-react';
import { foundationCopy, moduleSummaries } from '../../lib/foundationCopy';
import type { FoundationRouteId, FoundationViewer } from '../../lib/foundationTypes';

type OperationsHubProps = {
  viewer: FoundationViewer;
  onRouteChange: (route: FoundationRouteId) => void;
};

export function OperationsHub({ viewer, onRouteChange }: OperationsHubProps) {
  return (
    <section className="foundation-page">
      <p className="eyebrow">Welcome, {viewer.displayName}</p>
      <h1>{foundationCopy.hub.title}</h1>
      <p className="foundation-subtitle">{foundationCopy.hub.subtitle}</p>
      <div className="pillar-grid">
        <button className="foundation-module-card foundation-module-action" type="button" onClick={() => onRouteChange('rally-browse')}>
          <span className="foundation-module-icon" aria-hidden="true">
            <Radio size={22} />
          </span>
          <strong>{moduleSummaries.rallyPoint.action}</strong>
          <span>{moduleSummaries.rallyPoint.description}</span>
        </button>
        <button className="foundation-module-card foundation-module-action" type="button" onClick={() => onRouteChange('fleet-command')}>
          <span className="foundation-module-icon" aria-hidden="true">
            <ClipboardList size={22} />
          </span>
          <strong>{moduleSummaries.fleetCommand.action}</strong>
          <span>{moduleSummaries.fleetCommand.description}</span>
        </button>
        <button className="foundation-module-card foundation-module-action" type="button" onClick={() => onRouteChange('spoils')}>
          <span className="foundation-module-icon" aria-hidden="true">
            <Coins size={22} />
          </span>
          <strong>{moduleSummaries.spoils.action}</strong>
          <span>{moduleSummaries.spoils.description}</span>
        </button>
        <button className="foundation-module-card foundation-module-action" type="button" onClick={() => onRouteChange('proving-ground')}>
          <span className="foundation-module-icon" aria-hidden="true">
            <Trophy size={22} />
          </span>
          <strong>{moduleSummaries.provingGround.action}</strong>
          <span>{moduleSummaries.provingGround.description}</span>
        </button>
      </div>
      <div className="activity-grid">
        <article className="foundation-activity-panel">{foundationCopy.hub.emptyApprovals}</article>
        <article className="foundation-activity-panel">{foundationCopy.hub.emptySettlements}</article>
      </div>
    </section>
  );
}
