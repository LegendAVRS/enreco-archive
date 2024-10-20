import { create } from "zustand";
import { dummyData, dummyRelationships } from "@/lib/dummy";
import { ChartData, RelationshipStyle } from "@/lib/type";
interface ChartState {
    data: ChartData;
    setData: (data: ChartData) => void;
}

export const useChartStore = create<ChartState>((set) => ({
    data: {},

    setData: (data: ChartData) =>
        set(() => ({
            data,
        })),
}));
