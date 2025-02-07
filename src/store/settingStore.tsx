import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimestampOption = "none" | "modal" | "tab";

interface SettingState {
    timestampOption: TimestampOption;
    setTimestampOption: (timestampOption: TimestampOption) => void;

    bgmEnabled: boolean;
    setBgmEnabled: (checked: boolean) => void;
}

// Persists state in local storage
export const useSettingStore = create<SettingState>()(
    persist(
        (set) => ({
            timestampOption: "none",
            setTimestampOption: (timestampOption: TimestampOption) =>
                set({ timestampOption }),
            bgmEnabled: true,
            setBgmEnabled: (bgmEnabled) => set({ bgmEnabled }),
        }),
        { name: "setting" },
    ),
);
