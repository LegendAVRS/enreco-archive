import React, { createContext, ReactNode, useState } from "react";

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
    // const edgeVisibilityData = relationshipTypes;
    const edgeVisibilityMap: Visibility = {
        romantic: true,
        family: true,
    };

    const [edgeVisibilities, setEdgeVisibilities] =
        useState<Visibility>(edgeVisibilityMap);
    const [nodeVisibilities, setNodeVisibilities] = useState<Visibility>({});

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
