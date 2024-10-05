import { Edge } from "@xyflow/react";
import { ChartData, ImageNode } from "./type";

const generateDummyData = (numOfNodes: number): ChartData => {
    const nodes: ImageNode[] = Array.from({ length: numOfNodes }).map(
        (_, index) => {
            return {
                id: index.toString(),
                data: {
                    width: 100,
                    height: 100,
                    imageSrc: `https://picsum.photos/200?random=${index}`,
                },
                position: {
                    x: 0,
                    y: 0,
                },
                type: "imageNode",
            };
        }
    );

    const edges: Edge[] = [];
    for (let i = 0; i < numOfNodes; i++) {
        for (let j = i + 1; j < numOfNodes; j++) {
            edges.push({
                type: "smart",
                id: `${i}-${j}`,
                source: i.toString(),
                target: j.toString(),
            });
        }
    }

    return { nodes, edges };
};

export const hardCodeDummy: ChartData = {
    nodes: [
        {
            id: "0",
            data: {
                width: 100,
                height: 100,
                imageSrc: "https://picsum.photos/200?random=0",
            },
            position: {
                x: 0,
                y: 0,
            },
            type: "imageNode",
        },
        {
            id: "1",
            data: {
                width: 100,
                height: 100,
                imageSrc: "https://picsum.photos/200?random=1",
            },
            position: {
                x: 200,
                y: 0,
            },
            type: "imageNode",
        },
        {
            id: "2",
            data: {
                width: 100,
                height: 100,
                imageSrc: "https://picsum.photos/200?random=1",
            },
            position: {
                x: 200,
                y: 200,
            },
            type: "imageNode",
        },
    ],
    edges: [
        {
            type: "smart",
            id: "0",
            source: "0",
            target: "2",
        },
        {
            type: "smart",
            id: "1",
            source: "0",
            target: "1",
        },
        {
            type: "smart",
            id: "2",
            source: "1",
            target: "2",
        },
    ],
};

export const dummyData = generateDummyData(9);
// export const dummyData = hardCodeDummy;
