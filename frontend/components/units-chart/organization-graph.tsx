"use client";

import { Panel, ReactFlow, useReactFlow, type NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AppButton } from "@/components/common/ui/app-button";
import { rawUnits } from "@/data/org-units";
import { createGraph } from "@/utils/create-graph";
import { UnitCard } from "./unit-card";

const nodeTypes = { unit: UnitCard } satisfies NodeTypes;

function GraphControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <Panel position="top-right" className="max-w-[calc(100%-1rem)]">
      <div
        role="group"
        aria-label="کنترل‌های نمودار"
        className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-2"
      >
        <AppButton
          type="button"
          variant="secondary"
          size="sm"
          aria-label="بزرگ‌نمایی"
          onClick={() => void zoomIn()}
        >
          +
        </AppButton>

        <AppButton
          type="button"
          variant="secondary"
          size="sm"
          aria-label="کوچک‌نمایی"
          onClick={() => void zoomOut()}
        >
          −
        </AppButton>

        <AppButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void fitView({ padding: 0 })}
        >
          بازنشانی
        </AppButton>
      </div>
    </Panel>
  );
}

export function OrganizationGraph() {
  const { nodes, edges } = createGraph(rawUnits);

  return (
    <div className="h-[65svh] min-h-80 max-h-150 w-full min-w-0">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        panOnDrag
        zoomOnPinch
        fitView
        fitViewOptions={{
          padding: 0,
        }}
      >
        <GraphControls />
      </ReactFlow>
    </div>
  );
}
