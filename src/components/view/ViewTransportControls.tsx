import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Chapter } from "@/lib/type";

import { IconButton } from "@/components/ui/IconButton"

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
    onDayChange
}: ViewTransportControlsProps) {
    return(
        <div className="bg-transparent flex flex-col md:flex-row justify-start items-stretch md:items-center gap-2">
            <div className="flex-1 flex flex-row gap-2">
                <IconButton 
                    imageClassName="h-8 w-8"
                    tooltipText={"Previous Chapter"}
                    imageSrc={"/ui/caret-left-solid.svg"}
                    enabled={chapter !== 0}
                    onClick={() => onChapterChange(chapter - 1)}
                />

                {/* Chapter Selector */}
                <Select value={chapter.toString()} onValueChange={(value: string) => onChapterChange(parseInt(value))}>
                    <SelectTrigger className="grow" useUpChevron={true}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side={"top"}>
                        {
                            [...Array(numberOfChapters).keys()].map((index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                        { chapterData.title || `Chapter ${index + 1}` }
                                    </SelectItem>
                                )
                            )
                        }
                    </SelectContent>
                </Select>

                <IconButton 
                    imageClassName="h-8 w-8"
                    tooltipText={"Next Chapter"}
                    imageSrc={"/ui/caret-right-solid.svg"}
                    enabled={chapter !== numberOfChapters - 1}
                    onClick={() => onChapterChange(chapter + 1)}
                />
            </div>
            <div className="flex-1 flex flex-row gap-2">
                <IconButton 
                    imageClassName="h-8 w-8"
                    tooltipText={"Previous Day"}
                    imageSrc={"/ui/caret-left-solid.svg"}
                    enabled={day !== 0}
                    onClick={() => onDayChange(day - 1)}
                />

                {/* Day Selector */}
                <Select value={day.toString()} onValueChange={(value: string) => onDayChange(parseInt(value))}>
                    <SelectTrigger className="grow" useUpChevron={true}>
                        <SelectValue />    
                    </SelectTrigger>
                    <SelectContent side={"top"}>
                        {
                            [...Array(numberOfDays).keys()].map((index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                        { `Day ${index + 1}` }
                                    </SelectItem>
                                )
                            )
                        }
                    </SelectContent>
                </Select>

                <IconButton 
                    imageClassName="h-8 w-8"
                    tooltipText={"Next Day"}
                    imageSrc={"/ui/caret-right-solid.svg"}
                    enabled={day !== numberOfDays - 1}
                    onClick={() => onDayChange(day + 1)}
                />
            </div>
        </div>
    );
}