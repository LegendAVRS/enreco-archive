import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Chapter } from "@/lib/type";

import { IconButton } from "@/components/ui/IconButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useViewStore } from "@/store/viewStore";
import clsx from "clsx";

interface ViewTransportControlsProps {
    chapter: number;
    chapterData: Chapter;
    day: number;
    numberOfChapters: number;
    numberOfDays: number;
    onChapterChange: (newChapter: number) => void;
    onDayChange: (newDay: number) => void;
}

export function ViewTransportControls({
    chapter,
    chapterData,
    day,
    numberOfChapters,
    numberOfDays,
    onChapterChange,
    onDayChange,
}: ViewTransportControlsProps) {
    const viewStore = useViewStore();
    return (
        <div
            className={clsx(
                "flex justify-start items-stretch md:items-center gap-2 transition-all",
                {
                    // Hide when a card is selected
                    "opacity-0 invisible": viewStore.currentCard !== null,
                    "opacity-100 visible": viewStore.currentCard === null,
                }
            )}
        >
            <div className="flex-1 flex gap-2">
                <IconButton
                    className="h-10 hidden md:block"
                    tooltipText={"Previous Chapter"}
                    icon={<ChevronLeft />}
                    enabled={chapter !== 0}
                    onClick={() => onChapterChange(chapter - 1)}
                />

                {/* Chapter Selector */}
                <Select
                    value={chapter.toString()}
                    onValueChange={(value: string) =>
                        onChapterChange(parseInt(value))
                    }
                >
                    <SelectTrigger className="grow" useUpChevron={true}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side={"top"}>
                        {[...Array(numberOfChapters).keys()].map((index) => (
                            <SelectItem key={index} value={index.toString()}>
                                {chapterData.title || `Chapter ${index + 1}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <IconButton
                    className="h-10 hidden md:block"
                    tooltipText={"Next Chapter"}
                    icon={<ChevronRight />}
                    enabled={chapter !== numberOfChapters - 1}
                    onClick={() => onChapterChange(chapter + 1)}
                />
            </div>
            <div className="flex-1 flex gap-2 h-10">
                <IconButton
                    className="h-10 hidden md:block"
                    tooltipText={"Previous Day"}
                    icon={<ChevronLeft />}
                    enabled={day !== 0}
                    onClick={() => onDayChange(day - 1)}
                />

                {/* Day Selector */}
                <Select
                    value={day.toString()}
                    onValueChange={(value: string) =>
                        onDayChange(parseInt(value))
                    }
                >
                    <SelectTrigger className="grow" useUpChevron={true}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side={"top"}>
                        {[...Array(numberOfDays).keys()].map((index) => (
                            <SelectItem key={index} value={index.toString()}>
                                {`Day ${index + 1}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <IconButton
                    className="h-10 hidden md:block"
                    tooltipText={"Next Day"}
                    icon={<ChevronRight />}
                    enabled={day !== numberOfDays - 1}
                    onClick={() => onDayChange(day + 1)}
                />
            </div>
        </div>
    );
}
