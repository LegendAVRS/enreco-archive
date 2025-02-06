import { EDGE_WIDTH, OLD_EDGE_OPACITY } from "@/lib/constants";
import { generateOrthogonalEdgePath } from "@/lib/custom-edge-svg-path";
import { CustomEdgeOffsets, FixedEdgeProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import { BaseEdge, getSmoothStepPath, getStraightPath, Position } from "@xyflow/react";
import { memo, useMemo } from "react";

function generatePath(
    pathType: string | undefined, 
    offsets: CustomEdgeOffsets | undefined, 
    sourceX: number,
    sourceY: number,
    sourcePosition: Position | undefined,
    targetX: number,
    targetY: number,
    targetPosition: Position | undefined
) {
    if(pathType === "custom") {
        if(offsets === undefined) {
            throw new Error("offsets is undefined!");
        }

        const path = generateOrthogonalEdgePath(
            sourceX,
            sourceY,
            targetX,
            targetY,
            0,
            offsets
        );

        return path;
    }
    else if(pathType === "smoothstep") {
        const [path] = getSmoothStepPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
            borderRadius: 0,
        });

        return path;
    }
    else if(pathType === "straight") {
        const [path] = getStraightPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
        });

        return path;
    }
    else {
        throw new Error(`Unkwown pathType ${pathType}`);
    }
}

const ViewCustomEdge = ({ 
    data, 
    style,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
}: FixedEdgeProps) => {
    const isNew = data?.new || false;

    const path = useMemo(() => generatePath(
        data?.pathType,
        data?.offsets,
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    ), [data?.offsets, data?.pathType, sourcePosition, sourceX, sourceY, targetPosition, targetX, targetY]);

    return (
        <BaseEdge
            path={path}
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
                ...style
            }}
            interactionWidth={0}
        />
    );
};

export default memo(ViewCustomEdge);
