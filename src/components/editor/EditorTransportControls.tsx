import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { EditorChapter } from "@/lib/type";

import { IconButton } from "@/components/ui/IconButton";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import clsx from "clsx";

interface EditorTransportControlsProps {
    className?: string;
    chapter: number | null;
    chapters: EditorChapter[];
    day: number | null;
    onChapterChange: (newChapter: number) => void;
    onDayChange: (newDay: number) => void;
    onChapterAdd: () => void;
    onChapterDelete: () => void;
    onDayAdd: () => void;
    onDayDelete: () => void;
}

export function EditorTransportControls({
    className,
    chapter,
    chapters,
    day,
    onChapterChange,
    onDayChange,
    onChapterAdd,
    onChapterDelete,
    onDayAdd,
    onDayDelete
}: EditorTransportControlsProps) {
    const numberOfChapters = chapters.length;
    const numberOfDays = chapter === null ? 0 : chapters[chapter].charts.length;

    return (
        <div className={clsx(className, "flex flex-row")}>
            <div className="w-2/4 grid grid-rows-3 grid-cols-2 gap-x-2 gap-y-1 place-content-stretch mr-2">
                <span className="text-md col-span-2 font-bold">Chapters</span>

                <div className="col-span-2 flex flex-row content-center gap-x-2">
                    <IconButton
                        className="flex-none p-0"
                        tooltipText={"Previous Chapter"}
                        enabled={chapter !== 0 && chapter !== null}
                        onClick={() => onChapterChange((chapter || 0) - 1)}
                    >
                        <ChevronLeft />
                    </IconButton>

                    {/* Chapter Selector */}
                    <Select
                        value={chapter?.toString()}
                        onValueChange={(value: string) =>
                            onChapterChange(parseInt(value))
                        }
                    >
                        <SelectTrigger className="h-8 flex-1" useUpChevron={false}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent side={"bottom"}>
                            {chapters.map((elem, index) => (
                                <SelectItem value={index.toString()}>
                                    {elem.title || `Chapter ${index + 1}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <IconButton
                        className="flex-none p-0"
                        tooltipText={"Next Chapter"}
                        enabled={chapter !== numberOfChapters && chapter !== null}
                        onClick={() => onChapterChange((chapter || 0) + 1)}
                    >
                        <ChevronRight />
                    </IconButton>
                </div>

                <IconButton
                    className="w-full p-0 aspect-auto"
                    tooltipText={"Add Chapter"}
                    enabled={true}
                    onClick={() => onChapterAdd()}
                >
                    <Plus />
                </IconButton>

                <IconButton
                    className="w-full p-0 aspect-auto"
                    tooltipText={"Delete Chapter"}
                    enabled={numberOfChapters !== 0}
                    onClick={() => onChapterDelete()}
                >
                    <Minus />
                </IconButton>
            </div>
            <div className="w-2/4 grid grid-rows-3 grid-cols-2 gap-x-2 gap-y-1 place-content-stretch">
                <span className="text-md col-span-2 font-bold">Days</span>
                
                <div className="col-span-2 flex flex-row content-center gap-x-2">
                    <IconButton
                        className="flex-none p-0"
                        tooltipText={"Previous Day"}
                        enabled={day !== 0 && day !== null}
                        onClick={() => onDayChange((day || 0) - 1)}
                    >
                        <ChevronLeft />
                    </IconButton>

                    {/* Day Selector */}
                    <Select
                        value={day?.toString()}
                        onValueChange={(value: string) =>
                            onDayChange(parseInt(value))
                        }
                    >
                        <SelectTrigger className="flex-1 h-8" useUpChevron={false}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent side={"bottom"}>
                            {[...Array(numberOfDays).keys()].map((index) => (
                                <SelectItem value={index.toString()}>
                                    {`Day ${index + 1}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <IconButton
                        className="flex-none p-0"
                        tooltipText={"Next Day"}
                        enabled={day !== numberOfDays - 1 && day !== null}
                        onClick={() => onDayChange((day || 0) + 1)}
                    >
                        <ChevronRight />
                    </IconButton>
                </div>

                <IconButton
                    className="w-full p-0 aspect-auto"
                    tooltipText={"Add Day"}
                    enabled={true}
                    onClick={() => onDayAdd()}
                >
                    <Plus />
                </IconButton>

                <IconButton
                    className="w-full p-0 aspect-auto"
                    tooltipText={"Delete Day"}
                    enabled={numberOfDays !== 0}
                    onClick={() => onDayDelete()}
                >
                    <Minus />
                </IconButton>
            </div>
        </div>
    );
}