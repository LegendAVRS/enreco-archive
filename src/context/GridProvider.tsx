import { Grid } from "pathfinding";
import React, { createContext, ReactNode, useState } from "react";

export interface GridContextProps {
    grid: Grid;
    setGrid: React.Dispatch<React.SetStateAction<Grid>>;
}

export const GridContext = createContext<GridContextProps | undefined>(
    undefined
);

export const GridProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [gridData, setGrid] = useState<Grid>();

    return (
        <GridContext.Provider value={{ gridData, setGrid }}>
            {children}
        </GridContext.Provider>
    );
};
