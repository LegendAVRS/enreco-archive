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

    validateChapterAndDay: (chapter: number, day: number) => [number, number];
}
export const useViewStore = create<ViewState>((set, get) => {
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

        modalOpen: false,
        setModalOpen: (modalOpen: boolean) => set(() => ({ modalOpen })),
        siteData: {
            numberOfChapters: 0,
            event: "",
            chapters: [],
        },
        setSiteData: (siteData: SiteData) => {
            set(() => ({ siteData }));
            const [chapter, day] = get().validateChapterAndDay(get().chapter, get().day);
            set(() => ({ chapter, day }));
        },

        hoveredEdgeId: null,
        setHoveredEdgeId: (hoveredEdgeId: string) =>
            set(() => ({ hoveredEdgeId })),

        validateChapterAndDay: (chapter: number, day: number): [number, number] => {
            const { siteData } = get();
            const numberOfChapters = siteData.numberOfChapters;
            const numberOfDays = siteData.chapters[chapter].numberOfDays;

            const validChapter = (chapter >= 0 && chapter < numberOfChapters) ? chapter : 0;
            const validDay = (day >= 0 && day < numberOfDays) ? day : 0;

            return [validChapter, validDay];
        }
    };
});
