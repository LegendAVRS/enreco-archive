import { SiteData } from "@/lib/type";
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

    modalOpen: boolean;
    setModalOpen: (isModalOpen: boolean) => void;
    siteData: SiteData;
    setSiteData: (data: SiteData) => void;

    hoveredEdgeId: string | null;
    setHoveredEdgeId: (hoveredEdgeId: string) => void;
}

export const useViewStore = create<ViewState>((set) => {
    // If the chapter and day are set in the URL, then use that; otherwise
    // default to 0/0.

    const isBrowserWindowReady = (): boolean => typeof window !== 'undefined';
    const parseOrZero = (value: string): number => {
        const parsed = parseInt(value, 10);
        return Number.isNaN(parsed) ? 0 : parsed
    }

    function getChapterAndDay(): [number, number] {
        if (isBrowserWindowReady()) {
            const { hash } = window.location;
            const parts = hash.split("/");

            if (parts.length === 2) {
                let chapter = parseOrZero(parts[0]);
                let day = parseOrZero(parts[1]);

                // TODO: Verify the chapter and day are within limits?
                return [chapter, day]
            }
            return [0, 0]

        }

        return [0, 0]
    }

    const [initialChapter, initialDay] = getChapterAndDay();
    console.log(`URL hash verification - chapter: ${initialChapter}, day: ${initialDay}`)

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
        setCharacterVisibility: (characterVisibility: { [key: string]: boolean }) =>
            set(() => ({ characterVisibility })),

        modalOpen: false,
        setModalOpen: (modalOpen: boolean) => set(() => ({ modalOpen })),
        siteData: { event: "", chapter: { title: "", charts: [] } },
        setSiteData: (siteData: SiteData) => set(() => ({ siteData })),

        hoveredEdgeId: null,
        setHoveredEdgeId: (hoveredEdgeId: string) => set(() => ({ hoveredEdgeId })),
    }
});
