import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useChartStore } from "@/store/chartStore";
import { useViewStore } from "@/store/viewStore";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useEffect, useRef, useState } from "react";
import { SCROLL_THRESHOLD } from "@/lib/constants";

const ViewGeneralCard = () => {
    const { data } = useChartStore();
    const { siteData, setModalOpen, chapter, day, setDay } = useViewStore();
    const [isHeaderVisible, setIsHeaderVisible] = useState(true); // Track header visibility
    const contentRef = useRef<HTMLDivElement>(null); // Ref for scrollable content
    const headerRef = useRef<HTMLDivElement>(null); // Ref for header

    const currentChapter = siteData?.chapter;

    // Reset scroll position and header visibility when chapter or day changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
        setIsHeaderVisible(true); // Reset header visibility
    }, [chapter, day]);

    // Handle scroll event to toggle header visibility
    const handleScroll = () => {
        if (contentRef.current) {
            const threshold =
                contentRef.current.scrollHeight * SCROLL_THRESHOLD; // 5% of scrollable height
            setIsHeaderVisible(contentRef.current.scrollTop <= threshold);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 h-full">
            {/* Header */}
            <div
                ref={headerRef}
                className="flex flex-col gap-4 transition-all duration-300"
                style={{
                    opacity: isHeaderVisible ? 1 : 0,
                    transform: isHeaderVisible ? "scale(1)" : "scaleY(0)",
                    height: isHeaderVisible ? "113px" : 0,
                }}
            >
                {/* Info Button */}
                <Button variant="outline" onClick={() => setModalOpen(true)}>
                    Info
                </Button>

                {/* Selectors for Chapter and Day */}
                <div className="flex flex-row gap-4">
                    {/* Chapter Selector */}
                    <Select>
                        <SelectTrigger className="grow">
                            <SelectValue
                                placeholder={`Chapter ${chapter + 1}`}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Populate with chapter titles if available */}
                            {/* {siteData?.chapters?.map((chapter, index) => (
                                <SelectItem key={index} value={chapter.title}>
                                    {chapter.title}
                                </SelectItem>
                            ))} */}
                        </SelectContent>
                    </Select>

                    {/* Day Selector */}
                    <Select onValueChange={(e) => setDay(parseInt(e))}>
                        <SelectTrigger className="grow">
                            <SelectValue placeholder={`Day ${day + 1}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {currentChapter &&
                                currentChapter.charts.map((chart, index) => (
                                    <SelectItem
                                        key={index}
                                        value={index.toString()}
                                    >
                                        {chart.title}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
                <Separator />
            </div>

            {/* Scrollable Content */}
            <div
                ref={contentRef} // Ref for scrollable container
                className="overflow-auto pb-20"
                onScroll={handleScroll} // Track scroll position
            >
                <Markdown className="overflow-auto" rehypePlugins={[rehypeRaw]}>
                    {data?.dayRecap || "No content available."}
                </Markdown>
            </div>
        </div>
    );
};

export default ViewGeneralCard;
