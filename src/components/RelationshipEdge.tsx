import { relationshipTypes } from "@/lib/type";
import { BaseEdge, getSmoothStepPath, MarkerType } from "@xyflow/react";
import {
    SmoothStepEdge,
    SmoothStepEdgeInternal,
} from "node_modules/@xyflow/react/dist/esm/components/Edges/SmoothStepEdge";

const getEdgeStyle = (relationshipType: string) => {
    const stroke = relationshipTypes[relationshipType].color;
    const strokeDasharray =
        relationshipTypes[relationshipType].decoration === "dotted"
            ? "5 5"
            : "none";
    return {
        stroke,
        strokeDasharray,
    };
};

export const RelationshipEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
}) => {
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });
    return (
        <>
            <BaseEdge
                className="react-flow__edge-path"
                id={id}
                path={edgePath}
                style={getEdgeStyle(data.relationshipType)}
                markerEnd="url(#arrow)"
            />
        </>
    );
};
