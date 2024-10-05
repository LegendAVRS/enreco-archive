// globalGrid.ts
import { Grid } from "pathfinding";

let globalGrid: Grid | null = null;
let isGridInitialized = false;

export const getGlobalGrid = (columns: number, rows: number): Grid => {
    if (!globalGrid) {
        globalGrid = new Grid(columns, rows);
    }
    return globalGrid;
};

export const resetGlobalGrid = () => {
    globalGrid = null;
    isGridInitialized = false;
};

export const setGridInitialized = () => {
    isGridInitialized = true;
};

export const isGridAlreadyInitialized = () => {
    return isGridInitialized;
};
