import type { FleetCategoryKey, Member } from './types';

export type PersistedMemberAssignment = {
  displayName: string;
  requestId: string;
  team: string;
  shipName: string;
  categoryKey: FleetCategoryKey;
};

export function hydrateMembersFromPersistedAssignments(
  members: Member[],
  assignments: PersistedMemberAssignment[],
): Member[] {
  const assignmentsByName = new Map(
    assignments.map((assignment) => [normalizeMemberName(assignment.displayName), assignment]),
  );

  return members.map((member) => {
    const assignment = assignmentsByName.get(normalizeMemberName(member.name));

    if (!assignment) {
      return {
        ...member,
        assignedRequestId: undefined,
      };
    }

    return {
      ...member,
      assignedRequestId: assignment.requestId,
      team: assignment.team,
      shipOffer: assignment.categoryKey === 'marines' ? undefined : assignment.shipName,
    };
  });
}

function normalizeMemberName(name: string) {
  return name.trim().toLowerCase();
}
