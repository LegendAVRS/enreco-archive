import { Edge, EdgeProps, Node, NodeProps } from "@xyflow/react";
import { CSSProperties } from "react";

export type RelationshipStyle = { [key: string]: React.CSSProperties };
export type Teams = { [key: string]: { imageSrc: string } };

export type OldImageNodeData = {
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

export type OldCustomEdgeData = {
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

export type OldImageNodeType = Node<OldImageNodeData, "image">;
export type OldImageNodeProps = NodeProps<OldImageNodeType>;

export type OldCustomEdgeType = Edge<OldCustomEdgeData, "custom">;
export type OldCustomEdgeProps = EdgeProps<OldCustomEdgeType>;

export type OldSiteData = {
    numberOfChapters: number;
    event: string;
    chapters: OldChapter[];
};

export type OldChartData = {
    nodes: OldImageNodeType[];
    edges: OldCustomEdgeType[];
    relationships: RelationshipStyle;
    teams: Teams;
    dayRecap: string;
    title: string;
};

export type OldChapter = {
    numberOfDays: number;
    title: string;
    charts: OldChartData[];
};