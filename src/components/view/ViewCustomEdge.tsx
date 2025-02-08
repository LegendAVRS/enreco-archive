import { EDGE_WIDTH, OLD_EDGE_OPACITY } from "@/lib/constants";
import { generatePath } from "@/lib/get-edge-svg-path";
import { FixedEdgeProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useViewStore } from "@/store/viewStore";
import { BaseEdge } from "@xyflow/react";
import { memo, useMemo } from "react";

const ViewCustomEdge = ({
    data,
    style,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
}: FixedEdgeProps) => {
    const { day: currentDay } = useViewStore();
    const isNew = data?.day === currentDay || false;

    const path = useMemo(
        () =>
            generatePath(
                data?.pathType,
                data?.offsets,
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
            ),
        [
            data?.offsets,
            data?.pathType,
            sourcePosition,
            sourceX,
            sourceY,
            targetPosition,
            targetX,
            targetY,
        ],
    );

    return (
        <BaseEdge
            path={path}
            className={cn("transition-all", {
                "pointer-events-none": isNew === false,
            })}
            style={{
                strokeWidth:
                    data?.renderIsHoveredEdge && isNew
                        ? EDGE_WIDTH + 2
                        : EDGE_WIDTH,
                opacity: isNew ? 1 : OLD_EDGE_OPACITY,
                ...style,
            }}
            interactionWidth={20}
        />
    );
};

export default memo(ViewCustomEdge);
