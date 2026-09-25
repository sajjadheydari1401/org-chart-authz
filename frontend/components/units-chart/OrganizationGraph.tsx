import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { rawUnits } from "@/data/org-units";
import { createGraph } from "@/utils/create-graph";

export function OrganizationGraph() {
  const { nodes, edges } = createGraph(rawUnits);

  return (
    <div className="h-[600px] w-full">
      <ReactFlow
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
