import { create } from "zustand";
import { dummyData, dummyRelationships } from "@/lib/dummy";
import { ChartData, RelationshipStyle } from "@/lib/type";

interface ChartState {
    relationships: RelationshipStyle;
    setRelationships: (relationships: RelationshipStyle) => void;

    data: ChartData;
    setData: (data: ChartData) => void;
}

export const useChartStore = create<ChartState>((set) => ({
    relationships: dummyRelationships,
    setRelationships: (relationships: RelationshipStyle) =>
        set(() => ({ relationships })),

    data: dummyData,
    setData: (data: ChartData) => set(() => ({ data })),
}));
