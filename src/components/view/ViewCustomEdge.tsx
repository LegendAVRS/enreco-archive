import { EDGE_WIDTH, OLD_EDGE_OPACITY } from "@/lib/constants";
import { FixedEdgeProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import { BaseEdge } from "@xyflow/react";
import { memo } from "react";

const ViewCustomEdge = ({ data }: FixedEdgeProps) => {
    const isNew = data?.new || false;

    return (
        <BaseEdge
            path={data?.path || ""}
            className={cn("transition-all", {
                "pointer-events-none":
                    data?.new === false,
            })}
            style={{
                strokeWidth:
                    data?.renderIsHoveredEdge &&
                    data?.new !== false
                        ? EDGE_WIDTH + 2
                        : EDGE_WIDTH,
                opacity: isNew ? 1 : OLD_EDGE_OPACITY,
                ...data?.renderEdgeStyle
            }}
            interactionWidth={0}
        />
    );
};

export default memo(ViewCustomEdge);
