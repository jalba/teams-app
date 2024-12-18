import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import { Pencil } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

import { Team } from '@/models/teams';
import { Link } from 'react-router';
import { EditButton } from './edit-button';

export type TeamProps = Team & { hasChildren: boolean };

export type TeamNode = Node<TeamProps, 'team'>;

export const TeamNode = ({ data }: NodeProps<TeamNode>) => {
  const { name, description, department, members, parent_id, hasChildren } =
    data;
  return (
    <>
      {parent_id && <Handle type="target" position={Position.Top} />}
      <Card className="nodrag w-96">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              {name}
              <EditButton teamId={`${data.id}`} />
            </div>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{department}</p>
        </CardContent>
        <CardFooter>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Members</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      </Card>
      {hasChildren && <Handle type="source" position={Position.Bottom} />}
    </>
  );
};
