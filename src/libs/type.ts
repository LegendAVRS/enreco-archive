import { Edge, type Node } from "@xyflow/react";
export type ImageNodeData = {
    imageSrc: string;
    width?: number;
    height?: number;
    sourceHandles: { id: string }[];
    targetHandles: { id: string }[];
};

export type ImageNode = Node<ImageNodeData, "image">;

export type ChartData = {
    nodes: Node[];
    edges: Edge[];
};
