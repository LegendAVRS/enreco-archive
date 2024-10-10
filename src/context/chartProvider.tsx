import { dummyRelationships } from "@/lib/dummy";
import { RelationshipStyle } from "@/lib/type";
import React, { createContext, ReactNode, useState } from "react";

export interface ChartContextProps {
    relationships: RelationshipStyle;
    setRelationships: (relationships: RelationshipStyle) => void;
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
    return (
        <ChartContext.Provider value={{ relationships, setRelationships }}>
            {children}
        </ChartContext.Provider>
    );
};
