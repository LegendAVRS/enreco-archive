import { ChartData } from "@/lib/type";
import { create } from "zustand";
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
