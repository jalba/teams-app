import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';

import type { Route } from './+types/home';

import { getElementsWithLayout, getNodesAndEdges, noop } from '@/lib/utils';
import { getTeams, Team } from '@/models/teams';

import { TeamNode } from '@/components/team';

import '@xyflow/react/dist/style.css';
import { useEffect, useRef } from 'react';

const connectionLineStyle = {
  strokeWidth: 2,
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Teams App' },
    { name: 'description', content: 'Welcome to the Teams App!' },
  ];
}

const nodeTypes = {
  teamNode: TeamNode,
};

export async function loader() {
  const teams: Team[] | undefined = await getTeams();
  return { teams: teams ?? [] };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { nodes: initialNodes, edges: initialEdges } = getNodesAndEdges(
    loaderData.teams
  );
  const { fitView } = useReactFlow();
  const nodesSet = useRef<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    if (!nodesSet.current && nodes[0].measured) {
      const { nodes: newNodes, edges: newEdges } = getElementsWithLayout(
        nodes,
        edges
      );

      setNodes(newNodes);
      setEdges(newEdges);
      setTimeout(() => {
        fitView();
      }, 100);
      nodesSet.current = true;
    }
  }, [nodes]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        fitView
        nodes={nodes}
        edges={edges}
        onConnect={noop}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        edgesFocusable={false}
        nodesDraggable={false}
        nodesConnectable={false}
        draggable={false}
        panOnDrag={false}
        connectionLineStyle={connectionLineStyle}
      >
        <Background variant={'dots' as BackgroundVariant} gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
