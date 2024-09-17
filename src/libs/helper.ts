import { ChartData } from "./type";

// Modify directly on the nodes data, calculating how many nodes goes into and out of each node based on the edges data.
export const calculateHandlers = (data: ChartData) => {
    const nodes = data.nodes;
    const edges = data.edges;
    nodes.forEach((node) => {
        node.data.numOfTargets = edges.filter(
            (edge) => edge.target === node.id
        ).length;
        node.data.numOfSources = edges.filter(
            (edge) => edge.source === node.id
        ).length;
    });
};
