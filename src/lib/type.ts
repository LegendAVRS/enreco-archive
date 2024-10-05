import { Edge, Node } from "@xyflow/react";

export type ImageNode = Omit<Node, "data"> & {
    data: {
        imageSrc: string;
        width?: number;
        height?: number;
        numOfTargets?: number; // How many nodes go into this node
        numOfSources?: number; // How many nodes go out of this node
    };
    type: "imageNode";
};

export type EdgeType = "Marriage" | "Romaintic";

export type ChartData = {
    nodes: ImageNode[];
    edges: Edge[];
};
