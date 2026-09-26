import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";
import { cn } from "@/lib/cn";

export type UnitNode = Node<{ label: string }, "unit">;

export function UnitCard({ data, selected, isConnectable }: NodeProps<UnitNode>) {
  return (
    <AppCard
      className={cn(
        "relative h-full w-full [--xy-handle-background-color:var(--primary)] [--xy-handle-border-color:var(--surface)]",
        selected && "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <AppCardContent className="flex h-full min-w-0 items-center justify-center py-2">
        <p className="line-clamp-2 text-center text-sm font-medium text-foreground wrap-anywhere" title={data.label}>
          {data.label}
        </p>
      </AppCardContent>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </AppCard>
  );
}
