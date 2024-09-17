export type Node = {
    id: string;
    data: {
        imageSrc: string;
        width?: number;
        height?: number;
        numOfTargets?: number; // How many nodes goes into this node
        numOfSources?: number; // How many nodes goes out of this node
    };
    position: {
        x: number;
        y: number;
    };
    type: "imageNode";
};

export type EdgeType = "Marriage" | "Romaintic";

export type Edge = {
    type: "step";
    id: string;
    source: string;
    target: string;
};

export type ChartData = {
    nodes: Node[];
    edges: Edge[];
};
