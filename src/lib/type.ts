import { Edge, Node } from "@xyflow/react";
export type ImageNodeData = {
    imageSrc: string;
    width?: number;
    height?: number;
    sourceHandles: { id: string }[];
    targetHandles: { id: string }[];
};

export type RelationshipEdgeData = {
    relationshipType: string;
    description?: string;
    source?: string;
    timestamp?: number;
};

export type ImageNodeType = Node<ImageNodeData, "image">;
export type RelationshipEdgeType = Edge<RelationshipEdgeData, "relationship">;

export type ChartData = {
    nodes: ImageNodeType[];
    edges: RelationshipEdgeType[];
};

export type RelationshipType = Record<
    string,
    { color: string; decoration: string }
>;

export const relationshipTypes: RelationshipType = {
    romantic: {
        color: "red",
        decoration: "solid",
    },
    family: {
        color: "blue",
        decoration: "dotted",
    },
    friend: {
        color: "green",
        decoration: "dotted",
    },
};
