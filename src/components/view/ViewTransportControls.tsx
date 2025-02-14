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
import clsx from "clsx";
import { useEffect } from "react";

interface ViewTransportControlsProps {
    chapter: number;
    chapterData: Chapter[];
    day: number;
    numberOfChapters: number;
    numberOfDays: number;
    isCardOpen: boolean;
    onChapterChange: (newChapter: number) => void;
    onDayChange: (newDay: number) => void;
}

export default function ViewTransportControls({
    chapter,
    chapterData,
    day,
    numberOfChapters,
    numberOfDays,
    isCardOpen,
    onChapterChange,
    onDayChange,
}: ViewTransportControlsProps) {
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isCardOpen) return;

            if (event.key === "ArrowLeft") {
                if (day !== 0) onDayChange(day - 1);
            } else if (event.key === "ArrowRight") {
                if (day !== numberOfDays - 1) onDayChange(day + 1);
            } else if (event.key === "ArrowUp") {
                if (chapter !== 0) onChapterChange(chapter - 1);
            } else if (event.key === "ArrowDown") {
                if (chapter !== numberOfChapters - 1)
                    onChapterChange(chapter + 1);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        chapter,
        day,
        numberOfChapters,
        numberOfDays,
        isCardOpen,
        onChapterChange,
        onDayChange,
    ]);

    return (
        <div
            className={clsx(
                "flex justify-start items-stretch md:items-center gap-2 transition-all",
                {
                    // Hide when a card is selected
                    "opacity-0 invisible": isCardOpen,
                    "opacity-100 visible": !isCardOpen,
                },
            )}
        >
            <div className="flex-1 flex gap-2">
                <IconButton
                    className="h-10 w-10 p-0 hidden md:block"
                    tooltipText={"Previous Chapter"}
                    enabled={chapter !== 0}
                    onClick={() => onChapterChange(chapter - 1)}
                >
                    <ChevronLeft />
                </IconButton>

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
                        {Array.from(chapterData.entries()).map(
                            ([index, chapter]) => (
                                <SelectItem
                                    key={`${index}-${chapter.title}`}
                                    value={index.toString()}
                                >
                                    {chapter.title || `Chapter ${index + 1}`}
                                </SelectItem>
                            ),
                        )}
                    </SelectContent>
                </Select>

                <IconButton
                    className="h-10 w-10 p-0 hidden md:block"
                    tooltipText={"Next Chapter"}
                    enabled={chapter !== numberOfChapters - 1}
                    onClick={() => onChapterChange(chapter + 1)}
                >
                    <ChevronRight />
                </IconButton>
            </div>
            <div className="flex-1 flex gap-2 h-10">
                <IconButton
                    className="h-10 w-10 p-0 hidden md:block"
                    tooltipText={"Previous Day"}
                    enabled={day !== 0}
                    onClick={() => onDayChange(day - 1)}
                >
                    <ChevronLeft />
                </IconButton>

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
                    className="h-10 w-10 p-0 hidden md:block"
                    tooltipText={"Next Day"}
                    enabled={day !== numberOfDays - 1}
                    onClick={() => onDayChange(day + 1)}
                >
                    <ChevronRight />
                </IconButton>
            </div>
        </div>
    );
}
