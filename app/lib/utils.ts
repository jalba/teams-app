import { Edge, Node } from '@xyflow/react';
import Dagre from '@dagrejs/dagre';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Team } from '@/models/teams';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const noop = (): void => {
  return undefined;
};

export const getNodesAndEdges = (
  teams: Team[]
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodesWithChildren: Record<string, boolean> = {};

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const node = {
      id: `${team.id}`,
      type: 'teamNode',
      position: {
        x: 0,
        y: 0,
      },
      data: team,
    };

    nodes.push(node);
    if (team.parent_id) {
      const parentId = `${team.parent_id}`;
      nodesWithChildren[parentId] = true;
      const edge = {
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
      };
      edges.push(edge);
    }
  }

  for (let g = 0; g < nodes.length; g++) {
    const node = nodes[g];
    node.data.hasChildren = Boolean(nodesWithChildren[node.id]);
  }

  return { nodes, edges };
};

export const getElementsWithLayout = (
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[]; edges: Edge[] } => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB' });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      // @ts-ignore
      width: node.measured?.width || node.dimensions?.width || 0,
      // @ts-ignore
      height: node.measured?.height || node.dimensions?.height || 0,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};
