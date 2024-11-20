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

const ViewGeneralCard = () => {
    const { data } = useChartStore();
    const { siteData, setModalOpen, chapter, day, setDay } = useViewStore();
    const currentChapter = siteData.chapter;
    return (
        <div className="flex flex-col gap-4 p-4 h-full">
            <Button variant={"outline"} onClick={() => setModalOpen(true)}>
                Info
            </Button>
            <div className="flex flex-row gap-4">
                <Select>
                    <SelectTrigger className="grow">
                        <SelectValue placeholder={`Chapter ${chapter + 1}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {/* {siteData.chapters.map((chapter, index) => (
                            <SelectItem key={index} value={chapter.title}>
                                {chapter.title}
                            </SelectItem>
                        ))} */}
                    </SelectContent>
                </Select>
                <Select onValueChange={(e) => setDay(parseInt(e.valueOf()))}>
                    <SelectTrigger className="grow">
                        {/* Change placeholder and values later, +3 for now cause I haven't set the titles for each day yet */}
                        <SelectValue placeholder={`Day ${day + 3}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {currentChapter &&
                            currentChapter.charts.map((_, index) => (
                                <SelectItem
                                    key={index}
                                    value={index.toString()}
                                >
                                    {`Day ${index + 3}`}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
            <Separator />
            <Markdown className={"overflow-auto"} rehypePlugins={[rehypeRaw]}>
                {data.dayRecap}
            </Markdown>
        </div>
    );
};

export default ViewGeneralCard;
