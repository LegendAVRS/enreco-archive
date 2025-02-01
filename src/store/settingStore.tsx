import { create } from "zustand";
import { persist } from "zustand/middleware";

type TimestampOption = "none" | "modal" | "tab";

interface SettingState {
    timestampOption: TimestampOption;
    setTimestampOption: (timestampOption: TimestampOption) => void;
}

// Persists state in local storage
export const useSettingStore = create<SettingState>()(
    persist(
        (set) => ({
            timestampOption: "none",
            setTimestampOption: (timestampOption: TimestampOption) =>
                set({ timestampOption }),
        }),
        { name: "setting" }
    )
);
