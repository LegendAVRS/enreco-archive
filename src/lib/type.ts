import { Edge, Node } from "@xyflow/react";
export type ImageNodeData = {
    imageSrc: string;
    width?: number;
    height?: number;
    sourceHandles?: { id: string }[];
    targetHandles?: { id: string }[];
};

export type ImageNodeType = Node<ImageNodeData, "image">;

export type ChartData = {
    nodes: ImageNodeType[];
    edges: Edge[];
};
