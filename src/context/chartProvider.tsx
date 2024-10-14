import { dummyData, dummyRelationships } from "@/lib/dummy";
import { ChartData, RelationshipStyle } from "@/lib/type";
import React, { createContext, ReactNode, useState } from "react";

export interface ChartContextProps {
    relationships: RelationshipStyle;
    setRelationships: (relationships: RelationshipStyle) => void;

    data: ChartData;
    setData: (data: ChartData) => void;
}

export const ChartContext = createContext<ChartContextProps | undefined>(
    undefined
);

export interface ChartProviderProps {
    children: ReactNode;
}

export const ChartProvider: React.FC<ChartProviderProps> = ({ children }) => {
    const [relationships, setRelationships] =
        useState<RelationshipStyle>(dummyRelationships);

    const [data, setData] = useState<ChartData>(dummyData);

    return (
        <ChartContext.Provider
            value={{ relationships, setRelationships, data, setData }}
        >
            {children}
        </ChartContext.Provider>
    );
};
