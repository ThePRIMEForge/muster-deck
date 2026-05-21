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
        <button type="button" onClick={() => onRouteChange('rally-browse')}>
          <Radio size={22} />
          <strong>{moduleSummaries.rallyPoint.action}</strong>
          <span>{moduleSummaries.rallyPoint.description}</span>
        </button>
        <button type="button" onClick={() => onRouteChange('fleet-command')}>
          <ClipboardList size={22} />
          <strong>{moduleSummaries.fleetCommand.action}</strong>
          <span>{moduleSummaries.fleetCommand.description}</span>
        </button>
        <button type="button" onClick={() => onRouteChange('spoils')}>
          <Coins size={22} />
          <strong>{moduleSummaries.spoils.action}</strong>
          <span>{moduleSummaries.spoils.description}</span>
        </button>
        <button type="button" onClick={() => onRouteChange('proving-ground')}>
          <Trophy size={22} />
          <strong>{moduleSummaries.provingGround.action}</strong>
          <span>{moduleSummaries.provingGround.description}</span>
        </button>
      </div>
      <div className="activity-grid">
        <article>{foundationCopy.hub.emptyApprovals}</article>
        <article>{foundationCopy.hub.emptySettlements}</article>
      </div>
    </section>
  );
}
