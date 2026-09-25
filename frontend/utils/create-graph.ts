import dagre from "@dagrejs/dagre";
import type { Edge } from "@xyflow/react";

import type { UnitNode } from "@/components/units-chart/unit-card";
import type { OrgUnit } from "@/types/org-unit";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 60;

export function createGraph(units: OrgUnit[]) {
  const graph = new dagre.graphlib.Graph();

  // Dagre expects edge metadata even when we don't need custom edge data.
  graph.setDefaultEdgeLabel(() => ({}));

  // Configure a top-to-bottom organizational layout.
  // nodesep controls horizontal spacing between nodes.
  // ranksep controls vertical spacing between hierarchy levels.
  graph.setGraph({
    rankdir: "TB",
    nodesep: 50,
    ranksep: 80,
  });

  // React Flow needs flat nodes. Positions start at zero because
  // Dagre will calculate the actual coordinates later.
  const nodes: UnitNode[] = units.map((unit) => ({
    id: String(unit.id),
    type: "unit",
    style: { width: NODE_WIDTH, height: NODE_HEIGHT },
    data: {
      label: unit.name,
    },
    position: { x: 0, y: 0 },
  }));

  // parentId already describes the hierarchy, so each parent-child
  // relationship can be converted directly into a React Flow edge.
  const edges: Edge[] = units
    .filter((unit) => unit.parentId !== null)
    .map((unit) => ({
      id: `${unit.parentId}-${unit.id}`,
      source: String(unit.parentId),
      target: String(unit.id),
    }));

  // Dagre needs node dimensions to calculate spacing and avoid overlaps.
  for (const node of nodes) {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  }

  // Register the hierarchy with Dagre.
  for (const edge of edges) {
    graph.setEdge(edge.source, edge.target);
  }

  // Calculate x/y coordinates for every node.
  dagre.layout(graph);

  const positionedNodes = nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,

      // Dagre positions nodes from their center, while React Flow
      // positions nodes from their top-left corner.
      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: positionedNodes,
    edges,
  };
}
