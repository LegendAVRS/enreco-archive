import { EDGE_WIDTH, OLD_EDGE_OPACITY } from "@/lib/constants";
import { CustomEdgeProps } from "@/lib/type";
import { BaseEdge, getSmoothStepPath } from "@xyflow/react";

const EditorSmoothEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
}: CustomEdgeProps) => {
    const edgeStyle = data?.renderEdgeStyle || {};
    const strokeColor = edgeStyle?.stroke || "#000";

    const isNew = data?.new || false;

    const [path] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 0,
    });

    return (
        <>
            <svg width="0" height="0">
                <defs>
                    <marker
                        id={`arrow-${id}`}
                        viewBox="0 0 10 10"
                        refX="10" // Adjust reference point for correct positioning
                        refY="5" // Adjust to center the arrow on the line
                        markerWidth="4"
                        markerHeight="4"
                        className="stroke-[1]"
                        orient="auto-start-reverse" // Automatically orient the marker based on line direction
                    >
                        <path d="M0,0 L10,5 L0,10 z" fill={strokeColor} />
                    </marker>
                </defs>
            </svg>
            <BaseEdge
                path={path}
                style={{
                    strokeWidth: EDGE_WIDTH,
                    ...edgeStyle,
                    opacity: isNew ? 1 : OLD_EDGE_OPACITY,
                }}
                className="z-10"
                // markerEnd={data?.marker ? `url(#arrow-${id})` : ""}
            />
        </>
    );
};

export default EditorSmoothEdge;
