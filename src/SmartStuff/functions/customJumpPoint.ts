import { XYPosition } from "@xyflow/react";
import type { Grid } from "pathfinding";

export type PathFindingFunction = (
    grid: Grid,
    start: XYPosition,
    end: XYPosition
) => {
    fullPath: number[][];
    smoothedPath: number[][];
} | null;

const getNeighbors = (node: XYPosition, grid: Grid): XYPosition[] => {
    const neighbors: XYPosition[] = [];
    const { x, y } = node;

    if (grid.isWalkableAt(x - 1, y)) neighbors.push({ x: x - 1, y });
    if (grid.isWalkableAt(x + 1, y)) neighbors.push({ x: x + 1, y });
    if (grid.isWalkableAt(x, y - 1)) neighbors.push({ x, y: y - 1 });
    if (grid.isWalkableAt(x, y + 1)) neighbors.push({ x, y: y + 1 });

    return neighbors;
};

const jump = (
    grid: Grid,
    node: XYPosition,
    parent: XYPosition,
    end: XYPosition
): XYPosition | null => {
    const { x, y } = node;
    const { x: px, y: py } = parent;

    const dx = x - px;
    const dy = y - py;

    if (!grid.isWalkableAt(x, y)) return null;
    if (x === end.x && y === end.y) return node;

    if (dx !== 0) {
        if (
            (grid.isWalkableAt(x, y - 1) &&
                !grid.isWalkableAt(x - dx, y - 1)) ||
            (grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1))
        ) {
            return node;
        }
    } else if (dy !== 0) {
        if (
            (grid.isWalkableAt(x - 1, y) &&
                !grid.isWalkableAt(x - 1, y - dy)) ||
            (grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy))
        ) {
            return node;
        }
    }

    if (dx !== 0) {
        return jump(grid, { x: x + dx, y }, node, end);
    } else if (dy !== 0) {
        return jump(grid, { x, y: y + dy }, node, end);
    }

    return null;
};

const tracePath = (
    node: XYPosition,
    cameFrom: Map<string, XYPosition>
): number[][] => {
    const path: number[][] = [];
    let currentNode: XYPosition | undefined = node;

    while (currentNode) {
        path.push([currentNode.x, currentNode.y]);
        currentNode = cameFrom.get(`${currentNode.x},${currentNode.y}`);
    }

    return path.reverse();
};

const smoothenPath = (grid: Grid, path: number[][]): number[][] => {
    // Implement path smoothing logic here
    return path;
};

export const customPathfindingJumpPointNoDiagonal: PathFindingFunction = (
    grid,
    start,
    end
) => {
    try {
        const openList: XYPosition[] = [start];
        const cameFrom: Map<string, XYPosition> = new Map();
        const gScore: Map<string, number> = new Map();
        const fScore: Map<string, number> = new Map();

        gScore.set(`${start.x},${start.y}`, 0);
        fScore.set(
            `${start.x},${start.y}`,
            Math.abs(start.x - end.x) + Math.abs(start.y - end.y)
        );

        while (openList.length > 0) {
            openList.sort(
                (a, b) =>
                    (fScore.get(`${a.x},${a.y}`) || Infinity) -
                    (fScore.get(`${b.x},${b.y}`) || Infinity)
            );
            const current = openList.shift()!;
            if (current.x === end.x && current.y === end.y) {
                const fullPath = tracePath(current, cameFrom);
                const smoothedPath = smoothenPath(grid, fullPath);
                return { fullPath, smoothedPath };
            }

            const neighbors = getNeighbors(current, grid);
            for (const neighbor of neighbors) {
                const jumpPoint = jump(grid, neighbor, current, end);
                if (jumpPoint) {
                    const tentativeGScore =
                        (gScore.get(`${current.x},${current.y}`) || Infinity) +
                        grid.getWeightAt(jumpPoint.x, jumpPoint.y);
                    if (
                        tentativeGScore <
                        (gScore.get(`${jumpPoint.x},${jumpPoint.y}`) ||
                            Infinity)
                    ) {
                        cameFrom.set(`${jumpPoint.x},${jumpPoint.y}`, current);
                        gScore.set(
                            `${jumpPoint.x},${jumpPoint.y}`,
                            tentativeGScore
                        );
                        fScore.set(
                            `${jumpPoint.x},${jumpPoint.y}`,
                            tentativeGScore +
                                Math.abs(jumpPoint.x - end.x) +
                                Math.abs(jumpPoint.y - end.y)
                        );
                        if (
                            !openList.some(
                                (node) =>
                                    node.x === jumpPoint.x &&
                                    node.y === jumpPoint.y
                            )
                        ) {
                            openList.push(jumpPoint);
                        }
                    }
                }
            }
        }

        return null;
    } catch (e) {
        console.log(e);
        return null;
    }
};
