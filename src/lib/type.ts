import { Edge, EdgeProps, Node, NodeProps, Position } from "@xyflow/react";
export type ImageNodeData = {
    title: string;
    content: string;
    imageSrc: string;
    width?: number;
    height?: number;
    // handles will map {source + target} to {sourceHandle + targetHandle}
    handles: {
        [key: string]: {
            sourceHandle: string;
            targetHandle: string;
        };
    }; // key is source + target, value is sourceHandle + targetHandle
};

export type CustomEdgeData = {
    relationship?: string;
    title?: string;
    content?: string;
    timestampUrl?: string;
    path?: string;
};

export type ImageNodeType = Node<ImageNodeData, "image">;
export type ImageNodeProps = NodeProps<ImageNodeType>;

export type CustomEdgeType = Edge<CustomEdgeData, "custom">;
export type CustomEdgeProps = EdgeProps<CustomEdgeType>;

export type ChartData = {
    nodes: ImageNodeType[];
    edges: CustomEdgeType[];
    relationships: RelationshipStyle;
};

// Type that maps a string to a style object
export type RelationshipStyle = { [key: string]: React.CSSProperties };
