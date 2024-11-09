import { ChartData } from "@/lib/type";
import oldc from "@/data/day3.json";
import newc from "@/data/day4.json";

// export chart
export const exportChart = (chartData: ChartData) => {
    const dataStr = JSON.stringify(chartData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
        dataStr
    )}`;
    const exportFileDefaultName = "flow.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
};

// function to copy the old chart's edge data to the new chart if same source node, edge node and relationship type
export const copyEdgeData = (oldChart: ChartData, newChart: ChartData) => {
    const oldEdges = oldChart.edges;
    const newChartLocal = newChart;
    newChartLocal.edges.forEach((edge) => {
        const oldEdge = oldEdges.find(
            (oldEdge) =>
                oldEdge.source === edge.source &&
                oldEdge.target === edge.target &&
                oldEdge.data?.relationship === edge.data?.relationship
        );
        if (oldEdge) {
            // copy data except path and new
            const tempPath = edge.data?.path;
            edge.data = {
                ...oldEdge.data,
                new: false,
            };

            if (tempPath) {
                edge.data.path = tempPath;
            }
        }
    });
    return newChartLocal;
};

// function to copy the old chart's node data to the new chart if same imageSrc (exluding content)
export const copyNodeData = (oldChart: ChartData, newChart: ChartData) => {
    const oldNodes = oldChart.nodes;
    const newChartLocal = newChart;
    newChartLocal.nodes.forEach((node) => {
        const oldNode = oldNodes.find(
            (oldNode) => oldNode.data.imageSrc === node.data.imageSrc
        );
        if (oldNode) {
            // clone data except for data.content
            node.data = { ...oldNode.data, content: node.data.content };
        }
    });
    return newChartLocal;
};

export const copyChartData = (oldChart = oldc, newChart = newc) => {
    const newChartLocal = copyNodeData(oldChart, newChart);
    if (!newChartLocal.teams || Object.keys(newChartLocal.teams).length === 0) {
        newChartLocal.teams = oldChart.teams;
    }
    if (
        !newChartLocal.relationships ||
        Object.keys(newChartLocal.relationships).length === 0
    ) {
        newChartLocal.relationships = oldChart.relationships;
    }
    return copyEdgeData(oldChart, newChartLocal);
};
