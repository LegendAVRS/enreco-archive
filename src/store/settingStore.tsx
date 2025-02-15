import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimestampOption = "none" | "modal" | "tab";

interface SettingState {
    timestampOption: TimestampOption;
    setTimestampOption: (timestampOption: TimestampOption) => void;

    bgmVolume: number;
    setBgmVolume: (bgmVolume: number) => void;
    sfxVolume: number;
    setSfxVolume: (sfxVolume: number) => void;
}

// Persists state in local storage
export const useSettingStore = create<SettingState>()(
    persist(
        (set) => ({
            timestampOption: "none",
            setTimestampOption: (timestampOption: TimestampOption) =>
                set({ timestampOption }),
            bgmVolume: 0.5,
            setBgmVolume: (bgmVolume: number) => set({ bgmVolume }),
            sfxVolume: 1.0,
            setSfxVolume: (sfxVolume: number) => set({ sfxVolume }),
        }),
        { name: "setting" },
    ),
);
