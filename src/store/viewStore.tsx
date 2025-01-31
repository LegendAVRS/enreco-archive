import { create } from "zustand";
export type CardType = "node" | "edge" | "setting" | null;

interface ViewState {
    chapter: number;
    setChapter: (chapter: number) => void;

    day: number;
    setDay: (day: number) => void;

    currentCard: CardType;
    setCurrentCard: (name: CardType) => void;

    edgeVisibility: { [key: string]: boolean };
    setEdgeVisibility: (edgeVisibility: { [key: string]: boolean }) => void;

    teamVisibility: { [key: string]: boolean };
    setTeamVisibility: (teamVisibility: { [key: string]: boolean }) => void;

    characterVisibility: { [key: string]: boolean };
    setCharacterVisibility: (characterVisibility: {
        [key: string]: boolean;
    }) => void;

    infoModalOpen: boolean;
    setInfoModalOpen: (isInfoModalOpen: boolean) => void;

    settingsModalOpen: boolean;
    setSettingsModalOpen: (isSettingsModalOpen: boolean) => void;

    minigameModalOpen: boolean;
    setMinigameModalOpen: (isMinigameModalOpen: boolean) => void;

    hoveredEdgeId: string | null;
    setHoveredEdgeId: (hoveredEdgeId: string) => void;
}
export const useViewStore = create<ViewState>((set) => {
    const [initialChapter, initialDay] = [0, 0];

    return {
        chapter: initialChapter,
        setChapter: (chapter: number) => set(() => ({ chapter })),

        day: initialDay,
        setDay: (day: number) => set(() => ({ day })),

        currentCard: null,
        setCurrentCard: (currentCard: CardType) => set(() => ({ currentCard })),

        edgeVisibility: {},
        setEdgeVisibility: (edgeVisibility: { [key: string]: boolean }) =>
            set(() => ({ edgeVisibility })),

        teamVisibility: {},
        setTeamVisibility: (teamVisibility: { [key: string]: boolean }) =>
            set(() => ({ teamVisibility })),

        characterVisibility: {},
        setCharacterVisibility: (characterVisibility: {
            [key: string]: boolean;
        }) => set(() => ({ characterVisibility })),

        infoModalOpen: false,
        setInfoModalOpen: (isInfoModalOpen: boolean) =>
            set(() => ({ infoModalOpen: isInfoModalOpen })),

        settingsModalOpen: false,
        setSettingsModalOpen: (isSettingsModalOpen: boolean) =>
            set(() => ({ settingsModalOpen: isSettingsModalOpen })),

        minigameModalOpen: false,
        setMinigameModalOpen: (isMinigameModalOpen: boolean) =>
            set(() => ({ minigameModalOpen: isMinigameModalOpen })),

        hoveredEdgeId: null,
        setHoveredEdgeId: (hoveredEdgeId: string) =>
            set(() => ({ hoveredEdgeId })),
    };
});
