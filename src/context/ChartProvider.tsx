import React, { createContext, useState, ReactNode } from "react";

export type Visibility = Record<string, boolean>;
export type SetVisibility = React.Dispatch<React.SetStateAction<Visibility>>;

interface ChartContextProps {
    edgeVisibilities: Visibility;
    setEdgeVisibilities: SetVisibility;
    nodeVisibilities: Visibility;
    setNodeVisibilities: SetVisibility;
    day: number;
    setDay: React.Dispatch<React.SetStateAction<number>>;
}

const ChartContext = createContext<ChartContextProps | undefined>(undefined);

export const ChartProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [edgeVisibilities, setEdgeVisibilities] = useState<
        Record<string, boolean>
    >({});
    const [nodeVisibilities, setNodeVisibilities] = useState<
        Record<string, boolean>
    >({});
    const [day, setDay] = useState<number>(0);
    return (
        <ChartContext.Provider
            value={{
                edgeVisibilities,
                setEdgeVisibilities,
                nodeVisibilities,
                setNodeVisibilities,
                day,
                setDay,
            }}
        >
            {children}
        </ChartContext.Provider>
    );
};

export { ChartContext };
