import { ChartContext, ChartContextProps } from "@/context/ChartProvider";
import { useContext } from "react";

export const useChartContext = (): ChartContextProps => {
    const context = useContext(ChartContext);
    if (!context) {
        throw new Error(
            "useChartContext must be used within an EditorProvider"
        );
    }
    return context;
};
