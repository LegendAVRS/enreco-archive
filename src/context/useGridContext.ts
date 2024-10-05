import { GridContext, GridContextProps } from "@/context/GridProvider";
import { useContext } from "react";

export const useGridContext = (): GridContextProps => {
    const context = useContext(GridContext);
    if (!context) {
        throw new Error("useGridContext must be used within a GridProvider");
    }
    return context;
};
