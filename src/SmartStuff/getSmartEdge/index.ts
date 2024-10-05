// index.ts
import { EdgeProps, Node } from "@xyflow/react";
import {
    createGrid,
    getBoundingBoxes,
    gridToGraphPoint,
    pathfindingAStarDiagonal,
    svgDrawSmoothLinePath,
    toInteger,
} from "../functions";
import type {
    PointInfo,
    PathFindingFunction,
    SVGDrawFunction,
} from "../functions";
import { printGrid } from "@/lib/helper";

export type EdgeParams = Pick<
    EdgeProps,
    | "sourceX"
    | "sourceY"
    | "targetX"
    | "targetY"
    | "sourcePosition"
    | "targetPosition"
>;

export type GetSmartEdgeOptions = {
    gridRatio?: number;
    nodePadding?: number;
    drawEdge?: SVGDrawFunction;
    generatePath?: PathFindingFunction;
};

export type GetSmartEdgeParams<NodeDataType = unknown> = EdgeParams & {
    options?: GetSmartEdgeOptions;
    nodes: Node<NodeDataType>[];
};

export type GetSmartEdgeReturn = {
    svgPathString: string;
    edgeCenterX: number;
    edgeCenterY: number;
};

export const getSmartEdge = <NodeDataType = unknown>({
    options = {},
    nodes = [],
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
}: GetSmartEdgeParams<NodeDataType>): GetSmartEdgeReturn | null => {
    try {
        const {
            drawEdge = svgDrawSmoothLinePath,
            generatePath = pathfindingAStarDiagonal,
        } = options;

        let { gridRatio = 5, nodePadding = 8 } = options;
        gridRatio = toInteger(gridRatio);
        nodePadding = toInteger(nodePadding);

        const { graphBox, nodeBoxes } = getBoundingBoxes<NodeDataType>(
            nodes,
            nodePadding,
            gridRatio
        );

        const source: PointInfo = {
            x: sourceX,
            y: sourceY,
            position: sourcePosition,
        };

        const target: PointInfo = {
            x: targetX,
            y: targetY,
            position: targetPosition,
        };

        const { grid, start, end } = createGrid(
            graphBox,
            nodeBoxes,
            source,
            target,
            gridRatio
        );

        const generatePathResult = generatePath(grid, start, end);

        if (generatePathResult === null) {
            return null;
        }

        const { fullPath, smoothedPath } = generatePathResult;
        fullPath.forEach(([x, y]) => {
            // grid.setWalkableAt(x, y, false);
            console.log(x, y);
            grid.setWeightAt(x, y, 10);
        });
        console.log(printGrid(grid), start, end);

        const graphPath = smoothedPath.map((gridPoint) => {
            const [x, y] = gridPoint;
            const graphPoint = gridToGraphPoint(
                { x, y },
                graphBox.xMin,
                graphBox.yMin,
                gridRatio
            );
            return [graphPoint.x, graphPoint.y];
        });

        const svgPathString = drawEdge(source, target, graphPath);

        const index = Math.floor(fullPath.length / 2);
        const middlePoint = fullPath[index];
        const [middleX, middleY] = middlePoint;
        const { x: edgeCenterX, y: edgeCenterY } = gridToGraphPoint(
            { x: middleX, y: middleY },
            graphBox.xMin,
            graphBox.yMin,
            gridRatio
        );

        // Mark the path as non-walkable in the global grid

        return { svgPathString, edgeCenterX, edgeCenterY };
    } catch {
        return null;
    }
};

export type GetSmartEdgeFunction = typeof getSmartEdge;
