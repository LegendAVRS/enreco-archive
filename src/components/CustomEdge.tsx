import { useChartContext } from "@/context/useChartContext";
import { getEdgeStyle } from "@/lib/helper";
import { tempRelationshipTypes } from "@/lib/type";
import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

const getEdgeVisibilityStyle = (isVisible: boolean) => {
    return {
        opacity: isVisible ? "1" : "0.1",
    };
};

const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
}: EdgeProps) => {
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
    });
    const { relationshipVisibilities: edgeVisibilities } = useChartContext();

    const style = getEdgeStyle(data.relationshipType, tempRelationshipTypes);
    const visibilityStyle = getEdgeVisibilityStyle(
        edgeVisibilities[data.relationshipType]
    );

    console.log(edgeVisibilities, visibilityStyle);

    return (
        <BaseEdge
            path={edgePath}
            className="transition-all"
            style={{ ...style, ...visibilityStyle }}
        />
    );
};

export default CustomEdge;
