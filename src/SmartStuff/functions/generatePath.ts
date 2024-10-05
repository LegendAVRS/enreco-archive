// FIXME: The "pathfinding" module doe not have proper typings.
/* eslint-disable
	@typescript-eslint/no-unsafe-call,
	@typescript-eslint/no-unsafe-member-access,
	@typescript-eslint/no-unsafe-assignment,
	@typescript-eslint/ban-ts-comment,
*/
import { XYPosition } from "@xyflow/react";
import type { Grid } from "pathfinding";
import { AStarFinder, DiagonalMovement, Util } from "pathfinding";
import JPFNeverMoveDiagonally from "../JPFNeverMoveDiagonally";
import CustomAStarFinder from "@/SmartStuff/functions/CustomAStarFinder";

/**
 * Takes source and target {x, y} points, together with an grid representation
 * of the graph, and returns two arrays of number tuples [x, y]. The first
 * array represents the full path from source to target, and the second array
 * represents a condensed path from source to target.
 */
export type PathFindingFunction = (
    grid: Grid,
    start: XYPosition,
    end: XYPosition
) => {
    fullPath: number[][];
    smoothedPath: number[][];
} | null;

export const pathfindingAStarDiagonal: PathFindingFunction = (
    grid,
    start,
    end
) => {
    try {
        const finder = new AStarFinder({
            diagonalMovement: DiagonalMovement.Always,
        });
        const fullPath = finder.findPath(start.x, start.y, end.x, end.y, grid);
        const smoothedPath = Util.smoothenPath(grid, fullPath);
        if (fullPath.length === 0 || smoothedPath.length === 0) return null;
        return { fullPath, smoothedPath };
    } catch (e) {
        return null;
    }
};

export const pathfindingAStarNoDiagonal: PathFindingFunction = (
    grid,
    start,
    end
) => {
    try {
        const finder = new AStarFinder({
            diagonalMovement: DiagonalMovement.Never,
        });
        const fullPath = finder.findPath(start.x, start.y, end.x, end.y, grid);
        const smoothedPath = Util.smoothenPath(grid, fullPath);
        if (fullPath.length === 0 || smoothedPath.length === 0) return null;
        return { fullPath, smoothedPath };
    } catch {
        return null;
    }
};

export const pathfindingJumpPointNoDiagonal: PathFindingFunction = (
    grid,
    start,
    end
) => {
    try {
        // FIXME: The "pathfinding" module doe not have proper typings.
        // @ts-ignore
        // Replace this with newly created jumppoint
        const finder = new AStarFinder({
            diagonalMovement: DiagonalMovement.Never,
            heuristic: function (dx, dy) {
                // Heuristic that encourages straight paths, penalizing turns
                return Math.min(Math.abs(dx), Math.abs(dy));
            },
        });

        const fullPath = finder.findPath(
            start.x,
            start.y,
            end.x,
            end.y,
            grid.clone()
        );

        const smoothedPath = fullPath;
        // console.log(start.x, start.y, end.x, end.y, grid, smoothedPath);
        if (fullPath.length === 0 || smoothedPath.length === 0) return null;
        return { fullPath, smoothedPath };
    } catch (e) {
        console.log(e);
        return null;
    }
};
