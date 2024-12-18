import { db } from '@/db/index';
import { Member } from './members';

export type Team = {
  id: number;
  name: string;
  members: Member[];
  description: string | null;
  department: string | null;
  parent_id: number | null;
};

export type UpdateTeamData = {
  id: string;
  description: string | null;
  department: string | null;
  parent_id: string | null;
};

export async function getTeams() {
  try {
    const teams = await db.any(
      'SELECT t.*, jsonb_agg(m.*) members FROM teams t LEFT JOIN members m ON m.team_id = t.id GROUP BY t.id ORDER BY t.parent_id NULLS FIRST;'
    );
    return teams;
  } catch (e) {
    console.log(e);
  }
}

export async function getTeam(id: string) {
  try {
    const team = await db.one(
      `SELECT t.*, jsonb_agg(m.*) members FROM teams t LEFT JOIN members m ON m.team_id = t.id WHERE t.id = ${id} GROUP BY t.id;`
    );
    return team;
  } catch (e) {
    console.log(e);
  }
}

export async function getTeamsIds() {
  try {
    const teamsIds = await db.any(`SELECT t.id, t.name FROM teams t;`);
    return teamsIds;
  } catch (e) {
    console.log(e);
  }
}

export async function getChildrenTeamsIds(teamId: string) {
  try {
    const childrenTeams = await db.any(
      `SELECT t.id FROM teams t WHERE t.parent_id = ${teamId};`
    );
    return childrenTeams.map((child) => child.id);
  } catch (e) {
    console.log(e);
  }
}

function buildValues(data: UpdateTeamData) {
  const description = `'${data.description}'` || 'NULL';
  const department = `'${data.department}'` || 'NULL';
  const parent = data.parent_id === 'None' ? 'NULL' : data.parent_id;
  return `description=${description}, department=${department}, parent_id=${parent}`;
}

function buildChildrenValues(data: string[]) {
  let values = '';
  for (let i = 0; i < data.length; i++) {
    values += `(${data[i]})${i < data.length - 1 ? ',' : ''}`;
  }
  return values;
}

export async function updateTeam(data: UpdateTeamData) {
  try {
    const response = await db.none(
      `UPDATE teams t SET ${buildValues(data)} WHERE t.id = ${data.id};`
    );
    return response;
  } catch (e) {
    console.log(e);
  }
}

export async function updateChildrenTeams(data: string[]) {
  try {
    const response = await db.none(
      `UPDATE teams t SET parent_id=NULL FROM (values ${buildChildrenValues(data)}) as c(id)  WHERE t.id = c.id;`
    );
    return response;
  } catch (e) {
    console.log(e);
  }
}
