// printGrid.ts
import { Grid } from "pathfinding";

export const printGrid = (grid: Grid): string => {
    let gridString = "";
    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            if (grid.getWeightAt(x, y) > 1) {
                gridString += "w";
                continue;
            }
            gridString +=
                grid.isWalkableAt(x, y) && grid.getWeightAt(x, y) === 1
                    ? "."
                    : "#";
        }
        gridString += "\n";
    }
    return gridString;
};

import { ChartData } from "./type";

/**
 * Calculate and update the number of sources and targets for each node
 * This is nessesary in order to generate the correct number of handles for each node on render
 * Update the sourceHandle and targetHandle of each edge based on the number of sources and targets
 * This is nessesary because reactflow doesn't distrubute edges to handles automatically
 */

export const calculateHandles = (data: ChartData) => {
    const nodes = data.nodes;
    const edges = data.edges;
    const handleMap: Record<string, Record<string, number>> = {};

    nodes.forEach((node) => {
        handleMap[node.id] = { source: 0, target: 0 };
    });

    // Calculate the number of sources and targets for each node
    nodes.forEach((node) => {
        node.data.numOfTargets = edges.filter(
            (edge) => edge.target === node.id
        ).length;
        node.data.numOfSources = edges.filter(
            (edge) => edge.source === node.id
        ).length;

        handleMap[node.id]["source"] = node.data.numOfSources;
        handleMap[node.id]["target"] = node.data.numOfTargets;
    });

    // Update sourceHandle and targetHandle of each edge based on the handleMap
    edges.forEach((edge) => {
        edge.sourceHandle = `source-handle-${handleMap[edge.source]["source"]}`;
        edge.targetHandle = `target-handle-${handleMap[edge.target]["target"]}`;
        handleMap[edge.source]["source"]--;
        handleMap[edge.target]["target"]--;
    });
};

/**
 * Calculate the position of the nodes based on its index, putting them in a grid
 * The grid takes the closest square number to the number of nodes as the number of columns and rows
 * An offset is added to (try to) reduce the number of overlapping edges
 */
export const calculateNodePosition = (index: number, numOfNodes: number) => {
    const grid = Math.ceil(Math.sqrt(numOfNodes));
    const xOffset = -100 + Math.random() * 50;
    const yOffset = -100 + Math.random() * 50;
    const x = index % grid;
    const y = Math.floor(index / grid);
    return { x: x * 200, y: y * 200 };
};

/**
 * Loop through the nodes and update the position of each node using calculateNodePosition
 */
export const calculatePositions = (data: ChartData) => {
    const nodes = data.nodes;
    nodes.forEach((node, index) => {
        const position = calculateNodePosition(index, nodes.length);
        node.position.x = position.x;
        node.position.y = position.y;
    });
    data.nodes = nodes;
};

/**
 * Loop through the nodes and update the position of each node
 * The position are scattered randomly, but not too far from each other, like they're creating a cluster
 */
export const calculateRandomPositions = (data: ChartData) => {
    const nodes = data.nodes;
    nodes.forEach((node) => {
        node.position.x = Math.random() * 1000;
        node.position.y = Math.random() * 1000;
    });
    data.nodes = nodes;
};
