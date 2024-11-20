import { Edge, EdgeProps, Node, NodeProps } from "@xyflow/react";
export type ImageNodeData = {
    title?: string;
    content?: string;
    imageSrc?: string;
    width?: number;
    height?: number;
    team?: string;
    status?: string;
    new?: boolean;
};

export type CustomEdgeData = {
    relationship?: string;
    title?: string;
    content?: string;
    timestampUrl?: string;
    path?: string;
    marker?: boolean;
    new?: boolean;
};

export type ImageNodeType = Node<ImageNodeData, "image">;
export type ImageNodeProps = NodeProps<ImageNodeType>;

export type CustomEdgeType = Edge<CustomEdgeData, "custom">;
export type CustomEdgeProps = EdgeProps<CustomEdgeType>;

export type ChartData = {
    chapter: number;
    day: number;
    nodes: ImageNodeType[];
    edges: CustomEdgeType[];
    relationships: RelationshipStyle;
    teams: Teams;
    dayRecap: string;
    title: string;
};

export type Chapter = {
    numberOfDays: number;
    title: string;
    charts: ChartData[];
};

export type SiteData = {
    numberOfChapters: number;
    event: string;
    chapter: Chapter;
};

export type RelationshipStyle = { [key: string]: React.CSSProperties };
export type Teams = { [key: string]: { imageSrc: string } };
