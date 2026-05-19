import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CircleDot,
  Grid2X2,
  List,
  Lock,
  Plus,
  Search,
  Shield,
  Ship,
  Star,
  Unlock,
  UserRound,
  Users,
} from 'lucide-react';
import {
  categoryFilters,
  fallbackFleetRequests,
  fallbackMembers,
  teamFilters,
} from './lib/fallbackData';
import { getManufacturerLogo, getRequestImage } from './lib/fanKitAssets';
import { hasSupabaseConfig, loadShipCatalog } from './lib/supabase';
import type { FilterMode, FleetShipRequest, ShipCatalogRow, StaffingProfile } from './lib/types';

type ViewMode = 'list' | 'islands';

const profileLabels: Record<StaffingProfile, string> = {
  skeleton: 'Skeleton',
  standard: 'Standard',
  full_crew: 'Full Crew',
  custom: 'Custom',
};

const profileClassNames: Record<StaffingProfile, string> = {
  skeleton: 'profile-skeleton',
  standard: 'profile-standard',
  full_crew: 'profile-full',
  custom: 'profile-custom',
};

function App() {
  const [filter, setFilter] = useState<FilterMode>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [masterLocked, setMasterLocked] = useState(false);
  const [lockedTeams, setLockedTeams] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [expandedRequests, setExpandedRequests] = useState<Record<string, boolean>>({
    'idris-alpha': true,
  });
  const [shipCatalog, setShipCatalog] = useState<ShipCatalogRow[]>([]);
  const [catalogState, setCatalogState] = useState<'preview' | 'loading' | 'live' | 'error'>(
    hasSupabaseConfig ? 'loading' : 'preview',
  );

  useEffect(() => {
    let active = true;

    if (!hasSupabaseConfig) {
      return () => {
        active = false;
      };
    }

    loadShipCatalog()
      .then((rows) => {
        if (!active) {
          return;
        }

        setShipCatalog(rows);
        setCatalogState('live');
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setCatalogState('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleRequests = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return fallbackFleetRequests.filter((request) => {
      const matchesFilter =
        filter === 'all' ||
        request.categoryKey === filter ||
        (filter.startsWith('team:') && request.teamKey === filter.replace('team:', ''));

      const matchesSearch =
        search.length === 0 ||
        [request.shipName, request.manufacturer, request.team, request.categoryName]
          .join(' ')
          .toLowerCase()
          .includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  const totals = useMemo(() => {
    return fallbackFleetRequests.reduce(
      (total, request) => ({
        ships: total.ships + request.requestedCount,
        required: total.required + request.requiredPositions,
        assigned: total.assigned + request.assignedPositions,
        suggestions: total.suggestions + request.pendingSuggestions,
      }),
      { ships: 0, required: 0, assigned: 0, suggestions: 0 },
    );
  }, []);

  function unlockAll() {
    setMasterLocked(false);
    setLockedTeams({});
  }

  function toggleExpanded(requestId: string) {
    setExpandedRequests((current) => ({ ...current, [requestId]: !current[requestId] }));
  }

  return (
    <main className="app-shell">
      <aside className="left-rail">
        <div className="brand-block">
          <div className="brand-mark">
            <Ship size={24} />
          </div>
          <div>
            <p className="eyebrow">Star Citizen</p>
            <h1>Fleet Manager</h1>
          </div>
        </div>

        <nav className="filter-stack" aria-label="Fleet filters">
          <button
            className={filter === 'all' ? 'filter-button active' : 'filter-button'}
            onClick={() => setFilter('all')}
            type="button"
          >
            <CircleDot size={16} />
            <span>All</span>
            <strong>{fallbackFleetRequests.length}</strong>
          </button>

          <div className="filter-group-label">Ship Category</div>
          {categoryFilters.map((category) => {
            const count = fallbackFleetRequests.filter(
              (request) => request.categoryKey === category.key,
            ).length;

            return (
              <button
                className={filter === category.key ? 'filter-button active' : 'filter-button'}
                key={category.key}
                onClick={() => setFilter(category.key)}
                type="button"
              >
                <Shield size={16} />
                <span>{category.label}</span>
                <strong>{count}</strong>
              </button>
            );
          })}

          <div className="filter-group-label">Teams</div>
          {teamFilters.map((team) => {
            const teamKey = team.toLowerCase();
            const active = filter === `team:${teamKey}`;
            const locked = Boolean(lockedTeams[teamKey]);

            return (
              <div className={active ? 'team-filter active' : 'team-filter'} key={team}>
                <button onClick={() => setFilter(`team:${teamKey}`)} type="button">
                  <Users size={16} />
                  <span>{team}</span>
                </button>
                <button
                  className={locked ? 'lock-toggle locked' : 'lock-toggle'}
                  onClick={() =>
                    setLockedTeams((current) => ({ ...current, [teamKey]: !current[teamKey] }))
                  }
                  type="button"
                  aria-label={`${locked ? 'Unlock' : 'Lock'} ${team} ship roster`}
                >
                  {locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>
            );
          })}
        </nav>
      </aside>

      <section className="fleet-workspace">
        <header className="fleet-header">
          <div>
            <p className="eyebrow">Tactical Strike Group</p>
            <h2>Operation Fleet Build</h2>
          </div>
          <div className="header-actions">
            <button
              className={masterLocked ? 'icon-action locked' : 'icon-action'}
              onClick={() => setMasterLocked((current) => !current)}
              type="button"
              title="Master ship roster lock"
            >
              {masterLocked ? <Lock size={18} /> : <Unlock size={18} />}
              <span>{masterLocked ? 'Ship Roster Locked' : 'Ship Roster Open'}</span>
            </button>
            <button className="icon-action gold" onClick={unlockAll} type="button">
              <Unlock size={18} />
              <span>Unlock All</span>
            </button>
            <button className="icon-action primary" type="button">
              <Plus size={18} />
              <span>Add Slot</span>
            </button>
          </div>
        </header>

        <div className="summary-band">
          <div>
            <strong>{totals.ships}</strong>
            <span>ship slots</span>
          </div>
          <div>
            <strong>
              {totals.assigned}/{totals.required}
            </strong>
            <span>required filled</span>
          </div>
          <div>
            <strong>{totals.suggestions}</strong>
            <span>ship suggestions</span>
          </div>
          <div>
            <strong>{catalogState === 'live' ? shipCatalog.length : 288}</strong>
            <span>{catalogState === 'live' ? 'catalog ships' : 'catalog ready'}</span>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search fleet"
            />
          </div>
          <div className={`connection-pill ${catalogState}`}>
            {catalogState === 'live' && 'Live catalog'}
            {catalogState === 'loading' && 'Catalog loading'}
            {catalogState === 'error' && 'Catalog preview'}
            {catalogState === 'preview' && 'Design preview'}
          </div>
          <div className="view-switch" aria-label="View mode">
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              type="button"
              title="List view"
            >
              <List size={17} />
            </button>
            <button
              className={viewMode === 'islands' ? 'active' : ''}
              onClick={() => setViewMode('islands')}
              type="button"
              title="Island view"
            >
              <Grid2X2 size={17} />
            </button>
          </div>
        </div>

        <div className={`fleet-list ${viewMode}`} aria-label="Fleet ship requests">
          {visibleRequests.map((request) => (
            <ShipRequestRow
              key={request.id}
              request={request}
              locked={masterLocked || Boolean(lockedTeams[request.teamKey]) || request.locked}
              viewMode={viewMode}
              expanded={Boolean(expandedRequests[request.id])}
              onToggleExpanded={() => toggleExpanded(request.id)}
            />
          ))}
        </div>
      </section>

      <aside className="member-rail">
        <div className="member-header">
          <div>
            <p className="eyebrow">Members</p>
            <h2>{fallbackMembers.length} online</h2>
          </div>
          <UserRound size={20} />
        </div>

        <div className="member-list">
          {fallbackMembers.map((member) => (
            <article className="member-row" key={member.id}>
              <div className={`presence ${member.status}`} />
              <div className="member-copy">
                <strong>{member.name}</strong>
                <span>
                  {member.team} · {member.primaryRole}
                </span>
                {member.shipOffer && <em>{member.shipOffer}</em>}
              </div>
            </article>
          ))}
        </div>
      </aside>
    </main>
  );
}

function ShipRequestRow({
  request,
  locked,
  viewMode,
  expanded,
  onToggleExpanded,
}: {
  request: FleetShipRequest;
  locked: boolean;
  viewMode: ViewMode;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const fillRate = Math.min(
    100,
    Math.round((request.assignedPositions / Math.max(request.requiredPositions, 1)) * 100),
  );
  const manufacturerLogo = getManufacturerLogo(request.manufacturer);
  const requestImage = getRequestImage(request);

  return (
    <article className={`ship-card ${viewMode} ${expanded ? 'expanded' : ''}`}>
      <div className="ship-image" style={{ backgroundImage: `url("${requestImage ?? ''}")` }}>
        <CrewMarker
          profile={request.staffingProfile}
          hasMarines={request.hasMarines}
          isAdmiralShip={request.isAdmiralShip}
        />
      </div>

      <div className="ship-main">
        <div className="ship-title-row">
          <div className="ship-heading">
            <div className="ship-kicker">
              <span>{request.team}</span>
              <span>{request.categoryName}</span>
              {request.exactRequired && <span>Exact</span>}
            </div>
            <div className="ship-name-line">
              {manufacturerLogo && (
                <img
                  className="manufacturer-logo"
                  src={manufacturerLogo}
                  alt={`${request.manufacturer} logo`}
                />
              )}
              <h3>{request.shipName}</h3>
            </div>
          </div>
          <button
            className="expand-button"
            onClick={onToggleExpanded}
            type="button"
            aria-label={`${expanded ? 'Hide' : 'Show'} ${request.shipName} details`}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {expanded && <p>{request.notes}</p>}

        <div className="ship-meta">
          <span>Count {request.requestedCount}</span>
          <span className={profileClassNames[request.staffingProfile]}>
            {profileLabels[request.staffingProfile]}
          </span>
          <span className={locked ? 'lock-chip locked' : 'lock-chip'}>
            {locked ? <Lock size={13} /> : <Unlock size={13} />}
            {locked ? 'Ships locked' : 'Ships open'}
          </span>
        </div>
      </div>

      <div className="crew-column">
        <div className="crew-numbers">
          <strong>
            {request.assignedPositions}/{request.requiredPositions}
          </strong>
          <span>Required</span>
        </div>
        <div className="meter">
          <span style={{ width: `${fillRate}%` }} />
        </div>
        <div className="crew-flags">
          <span>{request.optionalPositions} optional</span>
          <span>{request.pendingSuggestions} suggestions</span>
        </div>
      </div>
    </article>
  );
}

function CrewMarker({
  profile,
  hasMarines,
  isAdmiralShip,
}: {
  profile: StaffingProfile;
  hasMarines: boolean;
  isAdmiralShip: boolean;
}) {
  return (
    <div className={isAdmiralShip ? 'crew-marker admiral' : 'crew-marker'}>
      {hasMarines && <ChevronUp className="marine-chevron" size={18} />}
      {isAdmiralShip && <Star className="admiral-star" size={22} />}
      <span className={profileClassNames[profile]} />
    </div>
  );
}

export default App;
