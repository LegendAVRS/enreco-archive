import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    const { siteData } = useViewStore();
    return (
        <Card className="flex flex-col gap-4 p-4">
            <Button variant={"outline"}>Info</Button>
            <div className="flex flex-row gap-4">
                <Select>
                    <SelectTrigger className="grow">
                        <SelectValue placeholder={"Chapter..."} />
                    </SelectTrigger>
                    <SelectContent>
                        {siteData.chapters.map((chapter, index) => (
                            <SelectItem key={index} value={chapter.title}>
                                {chapter.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="grow">
                        <SelectValue placeholder={"Day..."} />
                    </SelectTrigger>
                    <SelectContent>
                        {siteData.chapters[data.chapter].charts.map(
                            (day, index) => (
                                <SelectItem key={index} value={day.title}>
                                    {day.title}
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>
            </div>
            <Separator />
            <Markdown rehypePlugins={[rehypeRaw]}>{data.dayRecap}</Markdown>
        </Card>
    );
};

export default ViewGeneralCard;
