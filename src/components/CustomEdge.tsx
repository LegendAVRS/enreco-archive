import useEdgeStyle from "@/hooks/useEdgeStyle";
import { CustomEdgeProps } from "@/lib/type";
import { BaseEdge, getSmoothStepPath } from "@xyflow/react";

export default function PositionableEdge({
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
}: CustomEdgeProps) {
    const { edgeStyle } = useEdgeStyle(data?.relationship);
    const [path] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    console.log(data?.relationship);
    return <BaseEdge path={path} style={edgeStyle} />;
}
