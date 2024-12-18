import { db } from '@/db/index';

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type Member = {
  id: number;
  name: string;
  role: string;
  status: MemberStatus;
  team_id: number;
};

export type UpdateMemberData = {
  id: string;
  role: string | null;
  team_id: string | null;
};

export async function getTeamMembers(teamId: string) {
  try {
    const teamMembers = await db.any(
      `SELECT m.id FROM members m WHERE m.team_id = ${teamId}`
    );
    return teamMembers;
  } catch (e) {
    console.log(e);
  }
}

function buildMembersValues(members: UpdateMemberData[]) {
  let values = '';
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const role = member.role ?? 'NULL';
    const teamId = member.team_id ?? 'NULL';
    values += `(${member.id}, '${role}', ${teamId})${i < members.length - 1 ? ',' : ''}`;
  }
  return values;
}

export async function updateTeamMembership(members: UpdateMemberData[]) {
  console.log(buildMembersValues(members));
  try {
    const response = db.none(
      `UPDATE members m SET role = c.role, team_id = c.team_id FROM (values ${buildMembersValues(members)}) AS c(id, role, team_id)  WHERE m.id = c.id;`
    );
    return response;
  } catch (e) {
    console.log(e);
  }
}
