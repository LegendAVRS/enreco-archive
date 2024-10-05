// createGrid.ts
import { Position } from "@xyflow/react";
import type { GraphBoundingBox, NodeBoundingBox } from "./getBoundingBoxes";
import {
    getGlobalGrid,
    isGridAlreadyInitialized,
    setGridInitialized,
} from "./globalGrid";
import {
    getNextPointFromPosition,
    guaranteeWalkablePath,
} from "./guaranteeWalkablePath";
import { graphToGridPoint } from "./pointConversion";
import { round, roundUp } from "./utils";
import { Grid } from "pathfinding";

export type PointInfo = {
    x: number;
    y: number;
    position: Position;
};

export const createGrid = (
    graph: GraphBoundingBox,
    nodes: NodeBoundingBox[],
    source: PointInfo,
    target: PointInfo,
    gridRatio = 2
) => {
    const { xMin, yMin, width, height } = graph;

    const mapColumns = roundUp(width, gridRatio) / gridRatio + 1;
    const mapRows = roundUp(height, gridRatio) / gridRatio + 1;
    const grid = getGlobalGrid(mapColumns, mapRows);
    // const grid = new Grid(mapColumns, mapRows);

    // Update the grid representation with the space the nodes take up only once
    let tmp = !isGridAlreadyInitialized();
    // let tmp = true;
    if (tmp) {
        nodes.forEach((node) => {
            const nodeStart = graphToGridPoint(
                node.topLeft,
                xMin,
                yMin,
                gridRatio
            );
            const nodeEnd = graphToGridPoint(
                node.bottomRight,
                xMin,
                yMin,
                gridRatio
            );

            for (let x = nodeStart.x; x < nodeEnd.x; x++) {
                for (let y = nodeStart.y; y < nodeEnd.y; y++) {
                    grid.setWalkableAt(x, y, false);
                }
            }
        });
        setGridInitialized();
    }

    const startGrid = graphToGridPoint(
        {
            x: round(source.x, gridRatio),
            y: round(source.y, gridRatio),
        },
        xMin,
        yMin,
        gridRatio
    );

    const endGrid = graphToGridPoint(
        {
            x: round(target.x, gridRatio),
            y: round(target.y, gridRatio),
        },
        xMin,
        yMin,
        gridRatio
    );

    const startingNode = grid.getNodeAt(startGrid.x, startGrid.y);
    guaranteeWalkablePath(grid, startingNode, source.position);
    const endingNode = grid.getNodeAt(endGrid.x, endGrid.y);
    guaranteeWalkablePath(grid, endingNode, target.position);

    const start = getNextPointFromPosition(startingNode, source.position);
    const end = getNextPointFromPosition(endingNode, target.position);

    return { grid, start, end };
};
