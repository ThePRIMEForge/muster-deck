import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDot,
  ClipboardList,
  Grid2X2,
  List,
  Lock,
  Plus,
  Search,
  Shield,
  Ship,
  SlidersHorizontal,
  Trash2,
  Unlock,
  UserRound,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import {
  categoryFilters,
  fallbackFleetRequests,
  fallbackMembers,
  teamFilters,
} from './lib/fallbackData';
import { getManufacturerLogo, getRequestImage } from './lib/fanKitAssets';
import { hasSupabaseConfig, loadShipCatalog } from './lib/supabase';
import type {
  CrewAssignment,
  FilterMode,
  FleetShipRequest,
  Member,
  ShipCatalogRow,
  StaffingProfile,
} from './lib/types';

type ViewMode = 'list' | 'islands';

type ChangeRequest = {
  id: string;
  memberName: string;
  summary: string;
  status: 'pending' | 'approved' | 'denied';
};

type SetupShipOption = {
  name: string;
  manufacturer: string;
  categoryKey: FleetShipRequest['categoryKey'];
  categoryName: string;
  requiredPositions: number;
  optionalPositions: number;
  imageUrl?: string;
  positions: PositionRequirement[];
};

type PositionRequirement = {
  id: string;
  label: string;
  quantity: number;
};

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

const idrisPositions: PositionRequirement[] = [
  { id: 'pilot', label: 'Pilot', quantity: 1 },
  { id: 'co-pilot', label: 'Co-Pilot', quantity: 1 },
  { id: 'remote-s4', label: 'S4 Remote Turret', quantity: 4 },
  { id: 'primary-s7', label: 'Primary S7 Turret', quantity: 1 },
  { id: 'shoulder-s5', label: 'Shoulder S5 Turret', quantity: 4 },
  { id: 'keel-s5-forward', label: 'Forward Keel S5 Turret', quantity: 2 },
  { id: 'keel-s5-aft', label: 'Aft Keel S5 Turret', quantity: 2 },
  { id: 'aft-turret', label: 'Aft Turret', quantity: 1 },
  { id: 'doctor', label: 'Doctor', quantity: 1 },
  { id: 'engineer-lead', label: 'Lead Engineer', quantity: 1 },
  { id: 'engineer-assistant', label: 'Engineering Assistant', quantity: 3 },
  { id: 'marine-lead', label: 'Marine Lead', quantity: 1 },
  { id: 'marine-rifleman', label: 'Marine Rifleman', quantity: 8 },
  { id: 'flight-deck-lead', label: 'Flight Deck Operations Lead', quantity: 1 },
];

const perseusPositions: PositionRequirement[] = [
  { id: 'pilot', label: 'Pilot', quantity: 1 },
  { id: 'co-pilot', label: 'Co-Pilot', quantity: 1 },
  { id: 'remote-gunner', label: 'Remote Gunner', quantity: 1 },
  { id: 'primary-turret-deck', label: 'Primary Turret Deck', quantity: 1 },
  { id: 'primary-turret-keel', label: 'Primary Turret Keel', quantity: 1 },
  { id: 'engineer-lead', label: 'Engineer Lead', quantity: 1 },
  { id: 'engineer-assistant', label: 'Engineer Assistant', quantity: 1 },
  { id: 'marine-lead', label: 'Marine Lead', quantity: 1 },
  { id: 'marine-rifleman', label: 'Marine Rifleman', quantity: 4 },
];

const polarisPositions: PositionRequirement[] = [
  { id: 'pilot', label: 'Pilot', quantity: 1 },
  { id: 'co-pilot', label: 'Co-Pilot', quantity: 1 },
  { id: 'torpedo-operator', label: 'Torpedo Operator', quantity: 1 },
  { id: 'shoulder-s4', label: 'Quad S4 Shoulder Turret', quantity: 2 },
  { id: 'midship-turret', label: 'Midship Manned Turret', quantity: 2 },
  { id: 'remote-turret', label: 'Remote Turret', quantity: 2 },
  { id: 'engineer-lead', label: 'Lead Engineer', quantity: 1 },
  { id: 'engineer-assistant', label: 'Engineering Assistant', quantity: 2 },
  { id: 'medic', label: 'Medic', quantity: 1 },
  { id: 'marine-lead', label: 'Marine Lead', quantity: 1 },
  { id: 'marine-rifleman', label: 'Marine Rifleman', quantity: 6 },
];

const genericHeavyFighterPositions: PositionRequirement[] = [
  { id: 'pilot', label: 'Pilot', quantity: 1 },
  { id: 'turret-gunner', label: 'Turret Gunner', quantity: 1 },
];

const medicalSupportPositions: PositionRequirement[] = [
  { id: 'pilot', label: 'Pilot', quantity: 1 },
  { id: 'doctor', label: 'Doctor', quantity: 1 },
  { id: 'medic', label: 'Medic', quantity: 2 },
];

const marinePositions: PositionRequirement[] = [
  { id: 'marine-lead', label: 'Marine Lead', quantity: 1 },
  { id: 'marine-rifleman', label: 'Marine Rifleman', quantity: 6 },
  { id: 'medic', label: 'Medic', quantity: 1 },
];

const setupShipOptions: SetupShipOption[] = [
  {
    name: 'Idris',
    manufacturer: 'Aegis Dynamics',
    categoryKey: 'capital',
    categoryName: 'Capital',
    requiredPositions: 10,
    optionalPositions: 11,
    imageUrl: 'https://media.starcitizen.tools/d/dd/Idris_M_flying_over_world_-_cropped.jpg',
    positions: idrisPositions,
  },
  {
    name: 'Perseus',
    manufacturer: 'Roberts Space Industries',
    categoryKey: 'subcapital',
    categoryName: 'Subcapital',
    requiredPositions: 3,
    optionalPositions: 3,
    imageUrl: 'https://media.starcitizen.tools/6/6c/Perseus_angled_combat.jpg',
    positions: perseusPositions,
  },
  {
    name: 'Polaris',
    manufacturer: 'Roberts Space Industries',
    categoryKey: 'capital',
    categoryName: 'Capital',
    requiredPositions: 8,
    optionalPositions: 10,
    imageUrl: 'https://media.starcitizen.tools/a/ac/Polaris_flying_over_planet.jpg',
    positions: polarisPositions,
  },
  {
    name: 'Heavy Fighter Slot',
    manufacturer: 'Any',
    categoryKey: 'heavy_fighter',
    categoryName: 'Heavy Fighter',
    requiredPositions: 1,
    optionalPositions: 1,
    imageUrl: 'https://media.starcitizen.tools/3/30/RSI_Scorpius_on_ArcCorp.png',
    positions: genericHeavyFighterPositions,
  },
  {
    name: 'Medical Support Slot',
    manufacturer: 'Any',
    categoryKey: 'medium',
    categoryName: 'Medium',
    requiredPositions: 2,
    optionalPositions: 3,
    imageUrl: 'https://media.starcitizen.tools/a/ac/Cutlass_Red_Squad_Concept.jpg',
    positions: medicalSupportPositions,
  },
  {
    name: 'Marines/FPS',
    manufacturer: 'Fleet Infantry',
    categoryKey: 'marines',
    categoryName: 'Marines/FPS',
    requiredPositions: 6,
    optionalPositions: 2,
    positions: marinePositions,
  },
];

function App() {
  const [fleetRequests, setFleetRequests] = useState(fallbackFleetRequests);
  const [members, setMembers] = useState(fallbackMembers);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [masterLocked, setMasterLocked] = useState(false);
  const [lockedTeams, setLockedTeams] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [setupOpen, setSetupOpen] = useState(true);
  const [setupShipName, setSetupShipName] = useState('Perseus');
  const [setupTeamKey, setSetupTeamKey] = useState('alpha');
  const [setupProfile, setSetupProfile] = useState<StaffingProfile>('standard');
  const [setupCrewTarget, setSetupCrewTarget] = useState(3);
  const [customCrewOpen, setCustomCrewOpen] = useState(false);
  const [customPositions, setCustomPositions] =
    useState<PositionRequirement[]>(perseusPositions);
  const [requestPendingRemovalId, setRequestPendingRemovalId] = useState<string | null>(null);
  const [checkedInMembers, setCheckedInMembers] = useState<Record<string, boolean>>({});
  const [checkInMemberId, setCheckInMemberId] = useState<string | null>(null);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([
    {
      id: 'cr-1',
      memberName: 'Mako',
      summary: 'Offering Hurricane instead of Scorpius turret seat.',
      status: 'pending',
    },
  ]);
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

    return fleetRequests.filter((request) => {
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
  }, [fleetRequests, filter, searchTerm]);

  const totals = useMemo(() => {
    return fleetRequests.reduce(
      (total, request) => ({
        ships: total.ships + 1,
        required: total.required + request.requiredPositions,
        assigned: total.assigned + request.assignedPositions,
        suggestions: total.suggestions + request.pendingSuggestions,
      }),
      { ships: 0, required: 0, assigned: 0, suggestions: 0 },
    );
  }, [fleetRequests]);

  const memberGroups = useMemo(() => {
    const search = memberSearchTerm.trim().toLowerCase();
    const filteredMembers = members.filter((member) => {
      if (search.length === 0) {
        return true;
      }

      return [member.name, member.team, member.primaryRole, member.shipOffer ?? '']
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
    const available = filteredMembers.filter(
      (member) => !member.assignedRequestId && !member.shipOffer,
    );
    const unassignedShips = filteredMembers.filter(
      (member) => !member.assignedRequestId && member.shipOffer,
    );
    const assignedGroups = fleetRequests
      .map((request) => ({
        request,
        members: filteredMembers.filter((member) => member.assignedRequestId === request.id),
      }))
      .filter((group) => group.members.length > 0);

    return { available, unassignedShips, assignedGroups };
  }, [fleetRequests, memberSearchTerm, members]);

  const allVisibleExpanded =
    visibleRequests.length > 0 &&
    visibleRequests.every((request) => Boolean(expandedRequests[request.id]));
  const selectedSetupShip = setupShipOptions.find((ship) => ship.name === setupShipName);
  const removalRequest = fleetRequests.find((request) => request.id === requestPendingRemovalId);
  const checkInMember = members.find((member) => member.id === checkInMemberId);
  const checkInRequest = fleetRequests.find(
    (request) => request.id === checkInMember?.assignedRequestId,
  );

  function unlockAll() {
    setMasterLocked(false);
    setLockedTeams({});
  }

  function toggleExpanded(requestId: string) {
    setExpandedRequests((current) => ({ ...current, [requestId]: !current[requestId] }));
  }

  function toggleAllRosters() {
    const nextState = !allVisibleExpanded;

    setExpandedRequests((current) => ({
      ...current,
      ...Object.fromEntries(visibleRequests.map((request) => [request.id, nextState])),
    }));
  }

  function showDetails(requestId: string) {
    setExpandedRequests((current) => ({ ...current, [requestId]: true }));
  }

  function handleSetupShipChange(shipName: string) {
    const nextShip = setupShipOptions.find((ship) => ship.name === shipName);

    setSetupShipName(shipName);

    if (nextShip) {
      setCustomPositions(nextShip.positions);
      setSetupCrewTarget(Math.max(1, nextShip.requiredPositions));
    }
  }

  function requestRemoveFleetLine(requestId: string) {
    setRequestPendingRemovalId(requestId);
  }

  function confirmRemoveFleetLine() {
    if (!requestPendingRemovalId) {
      return;
    }

    setFleetRequests((current) =>
      current.filter((request) => request.id !== requestPendingRemovalId),
    );
    setMembers((current) =>
      current.map((member) =>
        member.assignedRequestId === requestPendingRemovalId
          ? { ...member, assignedRequestId: undefined }
          : member,
      ),
    );
    setExpandedRequests((current) => {
      const rest = { ...current };
      delete rest[requestPendingRemovalId];
      return rest;
    });
    setRequestPendingRemovalId(null);
  }

  function addBringShipRequest() {
    setChangeRequests((current) => [
      {
        id: `cr-${Date.now()}`,
        memberName: 'Incoming Crew',
        summary: 'Crew member wants to bring an unplanned ship for officer approval.',
        status: 'pending',
      },
      ...current,
    ]);
  }

  function addFleetLine() {
    if (!selectedSetupShip) {
      return;
    }

    const teamName = teamLabel(setupTeamKey);
    const requiredPositions =
      setupProfile === 'custom' ? Math.max(1, totalPositionQuantity(customPositions)) : setupCrewTarget;
    const newRequest: FleetShipRequest = {
      id: `${selectedSetupShip.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      team: teamName,
      teamKey: setupTeamKey,
      categoryKey: selectedSetupShip.categoryKey,
      categoryName: selectedSetupShip.categoryName,
      shipName: selectedSetupShip.name,
      manufacturer: selectedSetupShip.manufacturer,
      requestedCount: 1,
      staffingProfile: setupProfile,
      requiredPositions,
      optionalPositions: selectedSetupShip.optionalPositions,
      assignedPositions: 0,
      pendingSuggestions: 0,
      locked: false,
      exactRequired: selectedSetupShip.manufacturer !== 'Any',
      hasMarines: selectedSetupShip.categoryKey === 'marines',
      isAdmiralShip: false,
      notes:
        setupProfile === 'custom'
          ? `Custom crew target: ${customPositions
              .filter((position) => position.quantity > 0)
              .map((position) => `${position.quantity} ${position.label}`)
              .join(', ')}.`
          : `${profileLabels[setupProfile]} crew target created by fleet planning.`,
      imageUrl: selectedSetupShip.imageUrl,
      crew: buildCrewAssignments(
        setupProfile === 'custom'
          ? customPositions
          : buildProfilePositions(setupProfile, selectedSetupShip.positions),
      ),
    };

    setFleetRequests((current) => [newRequest, ...current]);
    setExpandedRequests((current) => ({ ...current, [newRequest.id]: true }));
    setFilter('all');
  }

  function moveRequestToTeam(requestId: string, teamKey: string) {
    setFleetRequests((current) =>
      current.map((request) =>
        request.id === requestId ? { ...request, teamKey, team: teamLabel(teamKey) } : request,
      ),
    );
  }

  function updateChangeRequest(requestId: string, status: ChangeRequest['status']) {
    setChangeRequests((current) =>
      current.map((request) => (request.id === requestId ? { ...request, status } : request)),
    );
  }

  function confirmCheckIn(memberId: string) {
    setCheckedInMembers((current) => ({ ...current, [memberId]: true }));
    setCheckInMemberId(null);
  }

  function requestCheckInChange(member: Member) {
    setChangeRequests((current) => [
      {
        id: `cr-${Date.now()}`,
        memberName: member.name,
        summary: `${member.name} requested a change to ship, team, or position during check-in.`,
        status: 'pending',
      },
      ...current,
    ]);
    setCheckInMemberId(null);
  }

  function handleMemberDrop(requestId: string, memberId: string) {
    const member = members.find((candidate) => candidate.id === memberId);
    const targetRequest = fleetRequests.find((request) => request.id === requestId);
    const sourceRequestId = member?.assignedRequestId;

    if (!member || !targetRequest) {
      return;
    }

    const crewEntry: CrewAssignment = {
      id: member.id,
      name: member.name,
      role: member.primaryRole,
      status: 'assigned',
    };

    setMembers((current) =>
      current.map((candidate) =>
        candidate.id === memberId
          ? {
              ...candidate,
              assignedRequestId: requestId,
              team: targetRequest.team,
              shipOffer: targetRequest.categoryKey === 'marines' ? undefined : targetRequest.shipName,
            }
          : candidate,
      ),
    );

    setFleetRequests((current) =>
      current.map((request) => {
        if (request.id !== requestId) {
          return {
            ...request,
            assignedPositions:
              request.id === sourceRequestId
                ? Math.max(0, request.assignedPositions - 1)
                : request.assignedPositions,
            crew: request.crew.filter((crew) => crew.id !== memberId),
          };
        }

        const alreadyAssignedHere = request.crew.some((crew) => crew.id === memberId);
        const nextCrew = request.crew.some((crew) => crew.id === memberId)
          ? request.crew.map((crew) => (crew.id === memberId ? crewEntry : crew))
          : [...request.crew, crewEntry];

        return {
          ...request,
          assignedPositions: alreadyAssignedHere
            ? request.assignedPositions
            : Math.min(request.requiredPositions + request.optionalPositions, request.assignedPositions + 1),
          crew: nextCrew,
        };
      }),
    );

    setExpandedRequests((current) => ({ ...current, [requestId]: true }));
  }

  return (
    <>
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
            <strong>{fleetRequests.length}</strong>
          </button>

          <div className="filter-group-label">Ship Category</div>
          {categoryFilters.map((category) => {
            const count = fleetRequests.filter(
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
            <button className="icon-action primary" onClick={() => setSetupOpen(true)} type="button">
              <Plus size={18} />
              <span>Add Slot</span>
            </button>
          </div>
        </header>

        <div className="summary-band">
          <div>
            <strong>{totals.ships}</strong>
            <span>fleet lines</span>
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

        <div className="planning-grid">
          <FleetSetupPanel
            open={setupOpen}
            selectedShipName={setupShipName}
            selectedTeamKey={setupTeamKey}
            selectedProfile={setupProfile}
            crewTarget={setupCrewTarget}
            customPositions={customPositions}
            onToggleOpen={() => setSetupOpen((current) => !current)}
            onShipChange={handleSetupShipChange}
            onTeamChange={setSetupTeamKey}
            onProfileChange={setSetupProfile}
            onCrewTargetChange={setSetupCrewTarget}
            onOpenCustomCrew={() => setCustomCrewOpen(true)}
            onAddFleetLine={addFleetLine}
          />
          <ChangeLogPanel requests={changeRequests} onUpdate={updateChangeRequest} />
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
          <button className="icon-action gold" onClick={addBringShipRequest} type="button">
            <Ship size={17} />
            <span>Bring Ship</span>
          </button>
          <button className="icon-action" onClick={toggleAllRosters} type="button">
            {allVisibleExpanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
            <span>{allVisibleExpanded ? 'Collapse Rosters' : 'Expand Rosters'}</span>
          </button>
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
              onShowDetails={() => showDetails(request.id)}
              onTeamChange={(teamKey) => moveRequestToTeam(request.id, teamKey)}
              onRemove={() => requestRemoveFleetLine(request.id)}
              onMemberDrop={(memberId) => handleMemberDrop(request.id, memberId)}
            />
          ))}
        </div>
      </section>

      <aside className="member-rail">
        <div className="member-header">
          <div>
            <p className="eyebrow">Members</p>
            <h2>{members.length} online</h2>
          </div>
          <UserRound size={20} />
        </div>

        <div className="member-search">
          <Search size={15} />
          <input
            value={memberSearchTerm}
            onChange={(event) => setMemberSearchTerm(event.target.value)}
            placeholder="Search members"
          />
        </div>

        <div className="member-list">
          <MemberGroup
            title="Available"
            checkedInMembers={checkedInMembers}
            members={memberGroups.available}
            onCheckIn={setCheckInMemberId}
          />
          <MemberGroup
            title="Unassigned Ships"
            checkedInMembers={checkedInMembers}
            members={memberGroups.unassignedShips}
            onCheckIn={setCheckInMemberId}
          />
          {memberGroups.assignedGroups.map((group) => (
            <MemberGroup
              key={group.request.id}
              title={group.request.shipName}
              ownerName={group.request.ownerName}
              checkedInMembers={checkedInMembers}
              members={group.members}
              onCheckIn={setCheckInMemberId}
            />
          ))}
        </div>
      </aside>
    </main>
    {customCrewOpen && (
      <CustomCrewModal
        positions={customPositions}
        onClose={() => setCustomCrewOpen(false)}
        onQuantityChange={(positionId, quantity) =>
          setCustomPositions((current) =>
            current.map((position) =>
              position.id === positionId ? { ...position, quantity: Math.max(0, quantity) } : position,
            ),
          )
        }
      />
    )}
    {removalRequest && (
      <ConfirmRemoveModal
        request={removalRequest}
        onCancel={() => setRequestPendingRemovalId(null)}
        onConfirm={confirmRemoveFleetLine}
      />
    )}
    {checkInMember && (
      <CheckInModal
        member={checkInMember}
        request={checkInRequest}
        onConfirm={() => confirmCheckIn(checkInMember.id)}
        onRequestChange={() => requestCheckInChange(checkInMember)}
        onClose={() => setCheckInMemberId(null)}
      />
    )}
    </>
  );
}

function FleetSetupPanel({
  open,
  selectedShipName,
  selectedTeamKey,
  selectedProfile,
  crewTarget,
  customPositions,
  onToggleOpen,
  onShipChange,
  onTeamChange,
  onProfileChange,
  onCrewTargetChange,
  onOpenCustomCrew,
  onAddFleetLine,
}: {
  open: boolean;
  selectedShipName: string;
  selectedTeamKey: string;
  selectedProfile: StaffingProfile;
  crewTarget: number;
  customPositions: PositionRequirement[];
  onToggleOpen: () => void;
  onShipChange: (shipName: string) => void;
  onTeamChange: (teamKey: string) => void;
  onProfileChange: (profile: StaffingProfile) => void;
  onCrewTargetChange: (crewTarget: number) => void;
  onOpenCustomCrew: () => void;
  onAddFleetLine: () => void;
}) {
  return (
    <section className="setup-panel">
      <button className="panel-title" onClick={onToggleOpen} type="button">
        <span>
          <SlidersHorizontal size={17} />
          Fleet Setup
        </span>
        {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
      </button>

      {open && (
        <div className="setup-content">
          <label>
            <span>Ship or slot</span>
            <select value={selectedShipName} onChange={(event) => onShipChange(event.target.value)}>
              {setupShipOptions.map((ship) => (
                <option key={ship.name} value={ship.name}>
                  {ship.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Team</span>
            <select value={selectedTeamKey} onChange={(event) => onTeamChange(event.target.value)}>
              {teamFilters.map((team) => (
                <option key={team} value={team.toLowerCase()}>
                  {team}
                </option>
              ))}
            </select>
          </label>

          <div className="profile-picker" aria-label="Staffing profile">
            {(Object.keys(profileLabels) as StaffingProfile[]).map((profile) => (
              <button
                className={selectedProfile === profile ? 'active' : ''}
                key={profile}
                onClick={() => onProfileChange(profile)}
                type="button"
              >
                {profileLabels[profile]}
              </button>
            ))}
          </div>

          <label>
            <span>Crew target</span>
            <input
              min={1}
              max={30}
              type="number"
              value={crewTarget}
              onChange={(event) => onCrewTargetChange(Number(event.target.value))}
            />
          </label>

          <button className="setup-secondary" onClick={onOpenCustomCrew} type="button">
            <ClipboardList size={16} />
            <span>{totalPositionQuantity(customPositions)} custom seats</span>
          </button>

          <button className="setup-submit" onClick={onAddFleetLine} type="button">
            <Plus size={16} />
            <span>Add Fleet Line</span>
          </button>
        </div>
      )}
    </section>
  );
}

function ChangeLogPanel({
  requests,
  onUpdate,
}: {
  requests: ChangeRequest[];
  onUpdate: (requestId: string, status: ChangeRequest['status']) => void;
}) {
  return (
    <section className="change-log">
      <div className="change-log-title">
        <span>
          <ClipboardList size={17} />
          Change Requests
        </span>
        <strong>{requests.filter((request) => request.status === 'pending').length}</strong>
      </div>
      <div className="change-log-list">
        {requests.map((request) => (
          <article className={`change-row ${request.status}`} key={request.id}>
            <div>
              <strong>{request.memberName}</strong>
              <span>{request.summary}</span>
            </div>
            <div className="change-actions">
              <button onClick={() => onUpdate(request.id, 'approved')} type="button">
                <CheckCircle2 size={15} />
              </button>
              <button onClick={() => onUpdate(request.id, 'denied')} type="button">
                <XCircle size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ShipRequestRow({
  request,
  locked,
  viewMode,
  expanded,
  onToggleExpanded,
  onShowDetails,
  onTeamChange,
  onMemberDrop,
  onRemove,
}: {
  request: FleetShipRequest;
  locked: boolean;
  viewMode: ViewMode;
  expanded: boolean;
  onToggleExpanded: () => void;
  onShowDetails: () => void;
  onTeamChange: (teamKey: string) => void;
  onMemberDrop: (memberId: string) => void;
  onRemove: () => void;
}) {
  const fillRate = Math.min(
    100,
    Math.round((request.assignedPositions / Math.max(request.requiredPositions, 1)) * 100),
  );
  const manufacturerLogo = getManufacturerLogo(request.manufacturer);
  const requestImage = getRequestImage(request);

  return (
    <article
      className={`ship-card ${viewMode} ${expanded ? 'expanded' : ''}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        const memberId = event.dataTransfer.getData('text/plain');
        if (memberId) {
          onMemberDrop(memberId);
        }
      }}
    >
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
              {request.ownerName && <span className="owner-chip">{request.ownerName}</span>}
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
          <button
            className="remove-line-button"
            onClick={onRemove}
            type="button"
            aria-label={`Remove ${request.shipName} from fleet roster`}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="ship-meta">
          <span>{request.ownerName ? 'Ship provided' : 'Ship needed'}</span>
          <span className={profileClassNames[request.staffingProfile]}>
            {profileLabels[request.staffingProfile]}
          </span>
          <span className={locked ? 'lock-chip locked' : 'lock-chip'}>
            {locked ? <Lock size={13} /> : <Unlock size={13} />}
            {locked ? 'Ships locked' : 'Ships open'}
          </span>
          <label className="team-assignment">
            <span>Team</span>
            <select value={request.teamKey} onChange={(event) => onTeamChange(event.target.value)}>
              {teamFilters.map((team) => (
                <option key={team} value={team.toLowerCase()}>
                  {team}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="signup-actions" aria-label={`${request.shipName} signup actions`}>
          <button type="button" onClick={onShowDetails} disabled={Boolean(request.ownerName)}>
            {request.ownerName ? 'Ship Provided' : 'Bring Ship'}
          </button>
          <button type="button" onClick={onShowDetails}>
            Fill Position
          </button>
        </div>
      </div>

      <div className="crew-column">
        <div className="fill-heading">
          <strong>{fillRate}%</strong>
          <span>Filled</span>
        </div>
        <div className="meter" aria-label={`${fillRate}% of required positions filled`}>
          <span style={{ width: `${fillRate}%` }} />
        </div>
        <div className="crew-numbers">
          <strong>
            {request.assignedPositions}/{request.requiredPositions}
          </strong>
          <span>Required</span>
        </div>
        <div className="crew-flags">
          <span>{request.optionalPositions} optional</span>
          <span>{request.pendingSuggestions} suggestions</span>
        </div>
      </div>

      {expanded && <CrewRoster request={request} />}
    </article>
  );
}

function CrewRoster({ request }: { request: FleetShipRequest }) {
  const crew = [...request.crew].sort((left, right) => rolePriority(left.role) - rolePriority(right.role));

  return (
    <section className="crew-roster" aria-label={`${request.shipName} crew roster`}>
      <div className="crew-roster-header">
        <strong>Crew</strong>
        <span>{request.notes}</span>
      </div>
      <div className="crew-roster-grid">
        {crew.map((crew) => (
          <div className="crew-roster-row" key={crew.id}>
            <span className={`crew-status ${crew.status}`} />
            <strong>{crew.name}</strong>
            <em>{crew.role}</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function MemberGroup({
  title,
  ownerName,
  checkedInMembers,
  members,
  onCheckIn,
}: {
  title: string;
  ownerName?: string;
  checkedInMembers: Record<string, boolean>;
  members: Member[];
  onCheckIn: (memberId: string) => void;
}) {
  if (members.length === 0) {
    return null;
  }

  return (
    <section className="member-group">
      <div className="member-group-title">
        <strong>{title}</strong>
        {ownerName && <span>{ownerName}</span>}
      </div>
      {members.map((member) => (
        <article
          className="member-row"
          draggable
          key={member.id}
          onDragStart={(event) => event.dataTransfer.setData('text/plain', member.id)}
        >
          <div className={`presence ${member.status}`} />
          <div className="member-copy">
            <strong>{member.name}</strong>
            <span>
              Online · {member.team} · {member.primaryRole}
            </span>
            {member.shipOffer && <em>{member.shipOffer}</em>}
          </div>
          <button className="checkin-button" onClick={() => onCheckIn(member.id)} type="button">
            {checkedInMembers[member.id] ? 'Checked' : 'Check In'}
          </button>
        </article>
      ))}
    </section>
  );
}

function CustomCrewModal({
  positions,
  onQuantityChange,
  onClose,
}: {
  positions: PositionRequirement[];
  onQuantityChange: (positionId: string, quantity: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label="Custom crew positions">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Custom Crew</p>
            <h2>Select Positions</h2>
          </div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="position-grid">
          {positions.map((position) => (
            <label className="position-option quantity" key={position.id}>
              <span>{position.label}</span>
              <input
                min={0}
                max={20}
                value={position.quantity}
                onChange={(event) => onQuantityChange(position.id, Number(event.target.value))}
                type="number"
              />
            </label>
          ))}
        </div>
        <button className="setup-submit modal-submit" onClick={onClose} type="button">
          Apply Positions
        </button>
      </section>
    </div>
  );
}

function CheckInModal({
  member,
  request,
  onConfirm,
  onRequestChange,
  onClose,
}: {
  member: Member;
  request?: FleetShipRequest;
  onConfirm: () => void;
  onRequestChange: () => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label="Member check-in">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Check In</p>
            <h2>{member.name}</h2>
          </div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="checkin-summary">
          <div>
            <span>Team</span>
            <strong>{request?.team ?? member.team}</strong>
          </div>
          <div>
            <span>Ship</span>
            <strong>{request?.shipName ?? member.shipOffer ?? 'Unassigned'}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{member.primaryRole}</strong>
          </div>
          <div>
            <span>Bring Ship</span>
            <strong>{member.shipOffer ?? 'No'}</strong>
          </div>
        </div>
        <div className="modal-actions">
          <button className="setup-submit" onClick={onConfirm} type="button">
            Confirm Check-In
          </button>
          <button className="setup-secondary" onClick={onRequestChange} type="button">
            Request Change
          </button>
        </div>
      </section>
    </div>
  );
}

function ConfirmRemoveModal({
  request,
  onConfirm,
  onCancel,
}: {
  request: FleetShipRequest;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal confirm-modal" role="dialog" aria-modal="true" aria-label="Remove ship">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Remove Fleet Line</p>
            <h2>{request.shipName}</h2>
          </div>
          <button className="modal-close" onClick={onCancel} type="button" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <p className="confirm-copy">
          Remove this ship or group from the operation roster? Assigned crew will return to the
          unassigned member list.
        </p>
        <div className="modal-actions">
          <button className="setup-secondary" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="danger-action" onClick={onConfirm} type="button">
            Remove Ship
          </button>
        </div>
      </section>
    </div>
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
      {hasMarines && <span className="marine-chevron" aria-hidden="true" />}
      {isAdmiralShip && <span className="admiral-star" aria-hidden="true" />}
      <span className={`crew-dot ${profileClassNames[profile]}`} />
    </div>
  );
}

function rolePriority(role: string) {
  const normalized = role.toLowerCase();

  if (
    normalized.includes('pilot') ||
    normalized.includes('admiral') ||
    normalized.includes('commander')
  ) {
    return 1;
  }

  if (normalized.includes('turret') || normalized.includes('gunner')) {
    return 2;
  }

  if (normalized.includes('engineer')) {
    return 3;
  }

  return 4;
}

function teamLabel(teamKey: string) {
  return teamFilters.find((team) => team.toLowerCase() === teamKey) ?? 'Unassigned';
}

function buildProfilePositions(profile: StaffingProfile, shipPositions: PositionRequirement[]) {
  if (profile === 'skeleton') {
    return shipPositions.filter((position) =>
      ['pilot', 'co-pilot'].includes(position.id),
    );
  }

  if (profile === 'standard') {
    return shipPositions.filter(
      (position) =>
        position.id.includes('pilot') ||
        position.id.includes('turret') ||
        position.id.includes('engineer-lead'),
    );
  }

  if (profile === 'full_crew') {
    return shipPositions;
  }

  return shipPositions.filter((position) => position.id === 'pilot');
}

function buildCrewAssignments(positions: PositionRequirement[]) {
  return positions.flatMap((position) =>
    Array.from({ length: position.quantity }, (_, index) => ({
      id: `crew-${Date.now()}-${position.id}-${index}`,
      name: 'Open',
      role: position.quantity > 1 ? `${position.label} ${index + 1}` : position.label,
      status: 'requested' as const,
    })),
  );
}

function totalPositionQuantity(positions: PositionRequirement[]) {
  return positions.reduce((total, position) => total + position.quantity, 0);
}

export default App;
