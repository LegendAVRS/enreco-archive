"use client";

import { Chapter } from "@/lib/type";
import { ViewTransportControls } from "./ViewTransportControls";
import { ViewOtherControlButtons } from "./ViewOtherControlButtons";
import { Drawer } from "vaul";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ViewBottomControlsProps {
    chapter: number;
    chapterData: Chapter;
    day: number;
    numberOfChapters: number;
    numberOfDays: number;
    onChapterChange: (newChapter: number) => void;
    onDayChange: (newDay: number) => void;
    onSettingsClick: () => void;
    onInfoClick: () => void;
}

export function ViewBottomControls({
    chapter,
    chapterData,
    day,
    numberOfChapters,
    numberOfDays,
    onChapterChange,
    onDayChange,
    onSettingsClick,
    onInfoClick,
}: ViewBottomControlsProps) { 
    return (
        <Drawer.Root modal={false}>
            <Drawer.Trigger asChild>
                <button id="open-controls-drawer" className="fixed inset-x-0 bottom-0 lg:m-auto rounded-t-[10px] h-10 w-full lg:w-3/5 max-w-full overflow-hidden bg-white">
                    <img id="drawer-arrow" className="relative left-2/4 right-2/4 translate-x-[-50%] h-full" src="/ui/caret-up-solid.svg"/>
                </button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-transparent" />
                <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-fit fixed inset-x-0 bottom-0 lg:m-auto w-full lg:w-3/5 max-w-full outline-none gap-2">
                    <VisuallyHidden>
                        <Drawer.Title>Controls</Drawer.Title>
                    </VisuallyHidden>
                    <Drawer.Close asChild>
                        <button className="relative inset-x-0 bottom-0 rounded-t-[10px] h-10 w-full overflow-hidden bg-white">
                            <img className="relative m-auto h-full" src="/ui/caret-down-solid.svg"/>
                        </button>
                    </Drawer.Close>
                    <div className="flex flex-col gap-4 m-2 mb-4">
                        <ViewTransportControls
                            chapter={chapter}
                            chapterData={chapterData}
                            day={day}
                            numberOfChapters={numberOfChapters}
                            numberOfDays={numberOfDays}
                            onChapterChange={onChapterChange}
                            onDayChange={onDayChange}
                        />
                        <ViewOtherControlButtons
                            onSettingsClick={onSettingsClick}
                            onInfoClick={onInfoClick}
                        />
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}