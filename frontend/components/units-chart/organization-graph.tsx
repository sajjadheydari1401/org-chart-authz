"use client";

import { ReactFlow, type NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { rawUnits } from "@/data/org-units";
import { createGraph } from "@/utils/create-graph";
import { UnitCard } from "./unit-card";

const nodeTypes = { unit: UnitCard } satisfies NodeTypes;

export function OrganizationGraph() {
  const { nodes, edges } = createGraph(rawUnits);

  return (
    <div className="h-150 w-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{
          padding: 0,
        }}
      />
    </div>
  );
}
