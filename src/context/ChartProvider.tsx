import { getDummyData } from "@/lib/dummy";
import { mapObjToStringBoolObj } from "@/lib/helper";
import { ChartData, RelationshipType } from "@/lib/type";
import React, { createContext, ReactNode, useState } from "react";

export type Visibility = Record<string, boolean>;
export type SetVisibility = React.Dispatch<React.SetStateAction<Visibility>>;

interface ChartContextProps {
    relationshipData: RelationshipType;
    setRelationshipData: React.Dispatch<React.SetStateAction<RelationshipType>>;
    relationshipVisibilities: Visibility;
    setRelationshipVisibilities: SetVisibility;
    guildVisibilities: Visibility;
    setGuildVisibilities: SetVisibility;
    day: number;
    setDay: React.Dispatch<React.SetStateAction<number>>;
    chartData: ChartData;
    setChartData: React.Dispatch<React.SetStateAction<ChartData>>;
}

const ChartContext = createContext<ChartContextProps | undefined>(undefined);

export const ChartProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const data = getDummyData();

    // Chart data
    const [chartData, setChartData] = useState<ChartData>(data);

    // A map holding the styles for a relationship type
    const [relationshipData, setRelationshipData] = useState<RelationshipType>(
        data.relationshipTypes
    );

    // A map holding the visibilities of the relationship types
    const [relationshipVisibilities, setRelationshipVisibilities] =
        useState<Visibility>(mapObjToStringBoolObj(relationshipData));

    // A map holding the visibilities of the nodes
    const [guildVisibilities, setGuildVisibilities] = useState<Visibility>(
        mapObjToStringBoolObj(data.guilds)
    );

    const [day, setDay] = useState<number>(0);
    return (
        <ChartContext.Provider
            value={{
                chartData,
                setChartData,
                relationshipData,
                setRelationshipData,
                relationshipVisibilities,
                setRelationshipVisibilities,
                guildVisibilities,
                setGuildVisibilities,
                day,
                setDay,
            }}
        >
            {children}
        </ChartContext.Provider>
    );
};

export { ChartContext };
