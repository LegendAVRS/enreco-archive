import { Edge, EdgeProps, Node, NodeProps } from "@xyflow/react";
export type ImageNodeData = {
    imageSrc: string;
    width?: number;
    height?: number;
    sourceHandles?: { id: string }[];
    targetHandles?: { id: string }[];
};

export type CustomEdgeData = {
    relationship: string;
    positionHandlers?: { x: number; y: number }[];
};

export type ImageNodeType = Node<ImageNodeData, "image">;
export type ImageNodeProps = NodeProps<ImageNodeType>;

export type CustomEdgeType = Edge<CustomEdgeData, "custom">;
export type CustomEdgeProps = EdgeProps<CustomEdgeType>;

export type ChartData = {
    nodes: ImageNodeType[];
    edges: CustomEdgeType[];
};

// Type that maps a string to a style object
export type RelationshipStyle = { [key: string]: React.CSSProperties };
