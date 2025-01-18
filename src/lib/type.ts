import { Edge, EdgeProps, Node, NodeProps } from "@xyflow/react";
import { CSSProperties } from "react";
export type ImageNodeData = {
    title?: string;
    content?: string;
    imageSrc?: string;
    width?: number;
    height?: number;
    team?: string;
    status?: string;
    new?: boolean;

    // The following properties are used during the rendering of this node,
    // and should not be filled by the data source.
    renderTeamImageSrc?: string;
};

export type CustomEdgeData = {
    relationship?: string;
    title?: string;
    content?: string;
    timestampUrl?: string;
    path?: string;
    marker?: boolean;
    new?: boolean;

    // The following properties are used during the rendering of this edge,
    // and should not be filled by the data source.
    renderEdgeStyle?: CSSProperties;
    renderIsHoveredEdge?: boolean;
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
    chapters: Chapter[];
};

export type RelationshipStyle = { [key: string]: React.CSSProperties };
export type Teams = { [key: string]: { imageSrc: string } };
export type StringToBooleanObjectMap = { [key: string]: boolean };
export type FitViewOperation = "fit-to-node" | "fit-to-edge" | "fit-to-all" | "none";