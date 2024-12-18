import { Form, Link } from 'react-router';
import { useToast } from '@/hooks/use-toast';
import { CircleX, CircleCheckBig, House } from 'lucide-react';

import {
  getChildrenTeamsIds,
  getTeam,
  getTeamsIds,
  Team,
  updateChildrenTeams,
  updateTeam,
  UpdateTeamData,
} from '@/models/teams';
import {
  getTeamMembers,
  UpdateMemberData,
  updateTeamMembership,
} from '@/models/members';
import type { Route } from './+types/team';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect } from 'react';
import { SelectGroup, SelectLabel } from '@radix-ui/react-select';
import Home from './home';

export async function loader({ params }: Route.LoaderArgs) {
  const team: Team = await getTeam(params.teamId);
  const teamsIds = await getTeamsIds();
  return { team: team ?? {}, teamsIds: teamsIds ?? [] };
}

export async function action({ request, params }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const childrenTeams = await getChildrenTeamsIds(params.teamId);
    let teamMembers = await getTeamMembers(params.teamId);
    const description = formData.get('description')?.toString();
    const department = formData.get('department')?.toString();
    const parent = formData.get('parent_id')?.toString();
    const currentParent = formData.get('currentParent')?.toString();
    const updateMembers: UpdateMemberData[] = [];
    const removeAsParent = parent !== currentParent && childrenTeams?.length;
    teamMembers = teamMembers || [];

    for (let i = 0; i < teamMembers.length; i++) {
      const member = formData.get(`member-${teamMembers[i].id}`)?.toString();
      let updateMember: UpdateMemberData;
      const role = formData.get(`member-${teamMembers[i].id}-role`)?.toString();
      const teamId = member ? params.teamId : null;
      updateMember = {
        id: teamMembers[i].id,
        role: role ?? null,
        team_id: teamId,
      };
      updateMembers.push(updateMember);
    }

    const teamUpate: UpdateTeamData = {
      id: params.teamId,
      description: description ?? null,
      department: department ?? null,
      parent_id: parent ?? 'None',
    };

    await updateTeam(teamUpate);
    if (removeAsParent && childrenTeams) {
      await updateChildrenTeams(childrenTeams);
    }
    await updateTeamMembership(updateMembers);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }

  return { error: undefined, submitted: true };
}

export default function Team({ loaderData, actionData }: Route.ComponentProps) {
  const { team, teamsIds } = loaderData;
  const { toast } = useToast();
  const parentId = team.parent_id ? `${team.parent_id}` : 'None';

  useEffect(() => {
    if (actionData?.error) {
      toast({
        title: 'Something went wrong',
        description: (
          <div key="error" className="flex flex-row">
            <CircleX color="red" />
            <span className="ml-2 self-center">
              {"We couldn't update the team. Please try again"}
            </span>
          </div>
        ),
      });
    }
    if (actionData?.submitted) {
      toast({
        title: 'Team updated!',
        description: (
          <div key="success" className="flex flex-row">
            <CircleCheckBig color="green" />
            <span className="ml-2 self-center">
              {'The new info was saved successfully!'}
            </span>
          </div>
        ),
      });
    }
  }, [actionData]);

  return (
    <>
      <Link className="flex flex-row pt-5 pl-2 mb-4 self-center" to="/">
        <House className="mr-3" color="blue" />
        Home
      </Link>
      <h1 className="ml-2">Edit team {team.name}</h1>
      <Form method="post" className="mt-6 w-96 ml-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col mb-6"></div>
          <div className="flex flex-col mb-6">
            <Label htmlFor="description" className="mb-1">
              Description
            </Label>
            <Textarea
              id="description"
              defaultValue={team.description ?? ''}
              name="description"
            />
          </div>
          <div className="flex flex-col mb-6">
            <Label htmlFor="department" className="mb-1">
              Department
            </Label>
            <Input
              id="department"
              type="text"
              defaultValue={team.department ?? ''}
              name="department"
            />
          </div>
          <div className="flex flex-col mb-6">
            <Label className="mb-1">Parent team</Label>
            <Select name="parent_id" defaultValue={parentId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a parent" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Teams</SelectLabel>
                  {teamsIds
                    .filter((t) => t.id !== team.id)
                    .map(({ id, name }) => (
                      <SelectItem key={name} value={`${id}`}>
                        {name}
                      </SelectItem>
                    ))}
                  <SelectItem value={'None'}>None</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <input
            type="hidden"
            value={team.parent_id ?? 'None'}
            name="currentParent"
          />
          <Separator />
          <h3>Team members</h3>
          {team.members.map((member) => {
            return (
              <div className="flex flex-row mb-6">
                <div className="w-[60%]">{member.name}</div>
                <Input
                  type="text"
                  name={`member-${member.id}-role`}
                  defaultValue={member.role}
                />
                <Checkbox
                  className="ml-2 self-center"
                  defaultChecked
                  name={`member-${member.id}`}
                  value={`${member.id}`}
                />
              </div>
            );
          })}
          <div className="flex flex-row-reverse mt-4">
            <Button>Save</Button>
          </div>
        </div>
      </Form>
    </>
  );
}
