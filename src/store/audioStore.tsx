"use client";
import { Howl } from "howler";
import { create } from "zustand";
import { useSettingStore } from "@/store/settingStore";
import { useEffect } from "react";

interface AudioState {
    bgm: Howl | null;
    sfx: { [key: string]: Howl };
    bgmVolume: number;
    sfxVolume: number;
    playBGM: () => void;
    stopBGM: () => void;
    playSFX: (name: string) => void;
    pauseBGM: () => void;
    setAllSfxVolume: (volume: number) => void;
    setBgmVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    bgm: new Howl({
        src: ["/audio/bgm-edit.mp3"],
        loop: true,
        volume: useSettingStore.getState().bgmVolume,
    }),
    sfx: {
        click: new Howl({
            src: ["/audio/click.mp3"],
            volume: useSettingStore.getState().sfxVolume,
        }),
        break: new Howl({
            src: ["/audio/break.mp3"],
            volume: useSettingStore.getState().sfxVolume,
        }),
        explosion: new Howl({
            src: ["/audio/explosion.mp3"],
            volume: useSettingStore.getState().sfxVolume,
        }),
        xp: new Howl({
            src: ["/audio/xp.mp3"],
            volume: useSettingStore.getState().sfxVolume,
        }),
    },
    bgmVolume: useSettingStore.getState().bgmVolume,
    sfxVolume: useSettingStore.getState().sfxVolume,
    playBGM: () => {
        const { bgm } = get();
        if (bgm && !bgm.playing()) {
            bgm.fade(0, get().bgmVolume, 1000);
            bgm.play();
        }
    },
    stopBGM: () => {
        const { bgm } = get();
        if (bgm) {
            bgm.fade(get().bgmVolume, 0, 1000);
            setTimeout(() => bgm.stop(), 1000);
        }
    },
    pauseBGM: () => {
        const { bgm } = get();
        // pause with a fade
        if (bgm && bgm.playing()) {
            bgm.fade(get().bgmVolume, 0, 1000);
            setTimeout(() => bgm.pause(), 1000);
        }
    },
    playSFX: (name: string) => {
        const { sfx, sfxVolume } = get();
        if (!sfx[name]) {
            const sound = new Howl({
                src: [`/audio/${name}.mp3`],
                volume: sfxVolume,
            });
            set((state) => ({ sfx: { ...state.sfx, [name]: sound } }));
            sound.play();
        } else {
            sfx[name].volume(sfxVolume);
            sfx[name].play();
        }
    },
    setAllSfxVolume: (volume: number) => {
        set({ sfxVolume: volume });
        const { sfx } = get();
        Object.values(sfx).forEach((sound) => sound.volume(volume));
    },
    setBgmVolume: (volume: number) => {
        set({ bgmVolume: volume });
        const { bgm } = get();
        if (bgm) {
            bgm.volume(volume);
        }
    },
}));

// Sync volumes with settingStore
export const useAudioSettingsSync = () => {
    const setBgmVolume = useAudioStore((state) => state.setBgmVolume);
    const setAllSfxVolume = useAudioStore((state) => state.setAllSfxVolume);

    useEffect(() => {
        const unsubscribeBgm = useSettingStore.subscribe((state) => {
            const bgmVolume: number = state.bgmVolume;
            setBgmVolume(bgmVolume);
        });

        const unsubscribeSfx = useSettingStore.subscribe((state) => {
            const sfxVolume: number = state.sfxVolume;
            setAllSfxVolume(sfxVolume);
        });

        return () => {
            unsubscribeBgm();
            unsubscribeSfx();
        };
    }, [setBgmVolume, setAllSfxVolume]);
};
