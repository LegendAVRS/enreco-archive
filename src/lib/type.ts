import { Edge, EdgeProps, Node, NodeProps } from "@xyflow/react";
export type ImageNodeData = {
    title: string;
    content: string;
    imageSrc: string;
    width?: number;
    height?: number;
    team: string;
};

export type CustomEdgeData = {
    relationship?: string;
    title?: string;
    content?: string;
    timestampUrl?: string;
    path?: string;
    marker?: string;
};

export type ImageNodeType = Node<ImageNodeData, "image">;
export type ImageNodeProps = NodeProps<ImageNodeType>;

export type CustomEdgeType = Edge<CustomEdgeData, "custom">;
export type CustomEdgeProps = EdgeProps<CustomEdgeType>;

export type ChartData = {
    nodes: ImageNodeType[];
    edges: CustomEdgeType[];
    relationships: RelationshipStyle;
    teams: Teams;
};

// Type that maps a string to a style object
export type RelationshipStyle = { [key: string]: React.CSSProperties };
export type Teams = { [key: string]: { imgSrc: string } };
