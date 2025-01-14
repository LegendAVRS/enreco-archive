import { ChartData } from "@/lib/type";
import { create } from "zustand";
interface ChartState {
    data: ChartData;
    setData: (data: ChartData) => void;
}

export const useChartStore = create<ChartState>((set) => ({
    data: {
        chapter: 0,
        day: 0,
        nodes: [],
        edges: [],
        relationships: {},
        teams: {},
        dayRecap: "",
        title: "",
    },

    setData: (data: ChartData) =>
        set(() => ({
            data,
        })),
}));
