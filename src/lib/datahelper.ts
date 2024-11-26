// @ts-nocheck
import { ChartData, SiteData } from "@/lib/type";
import day1 from "@/data/day1.json";
import day2 from "@/data/day2.json";
import day3 from "@/data/day3.json";
import day4 from "@/data/day4.json";
import day5 from "@/data/day5.json";
import day6 from "@/data/day6.json";
import day7 from "@/data/day7.json";
import day8 from "@/data/day8.json";

// export chart
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportJson = (data: any) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
        dataStr
    )}`;
    const exportFileDefaultName = data.title
        ? `${data.title}.json`
        : "data.json";
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
        } else {
            if (edge.data) {
                edge.data.new = true;
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
            node.data = {
                ...oldNode.data,
                content: node.data.content,
                new: node.data.new,
            };
        }
    });
    return newChartLocal;
};

export const copyChartData = (oldChart: ChartData, newChart: ChartData) => {
    // oldChart = oldChart || day1;
    // newChart = newChart || day2;
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

// Check if chart has missing properties
export const checkChartMissingData = (chartData: ChartData) => {
    if (!chartData.teams || Object.keys(chartData.teams).length === 0) {
        console.log("Teams data is missing");
    }
    if (
        !chartData.relationships ||
        Object.keys(chartData.relationships).length === 0
    ) {
        console.log("Relationships data is missing");
    }
    if (!chartData.dayRecap) {
        console.log("Day Recap data is missing");
    }
    if (!chartData.title) {
        console.log("Title data is missing");
    }

    if (!chartData.nodes || chartData.nodes.length === 0) {
        console.log("Nodes data is missing");
    }
    if (!chartData.edges || chartData.edges.length === 0) {
        console.log("Edges data is missing");
    }
};

export const mergeChartsIntoOneBigFile = async () => {
    const siteData: SiteData = {
        numberOfChapters: 1,
        event: "ENigmatic Recollection",
        chapter: {
            title: "ENigmatic Recollection Chapter 1",
            charts: [],
            numberOfDays: 8,
        },
    };

    const charts: ChartData[] = [
        day1,
        day2,
        day3,
        day4,
        day5,
        day6,
        day7,
        day8,
    ];

    siteData.chapter = {
        title: "ENigmatic Recollection Chapter 1",
        charts: charts,
        numberOfDays: 68,
    };
    return siteData;
};
