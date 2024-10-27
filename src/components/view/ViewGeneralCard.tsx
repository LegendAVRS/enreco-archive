import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useChartStore } from "@/store/chartStore";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const ViewGeneralCard = () => {
    const { data } = useChartStore();
    return (
        <Card className="flex flex-col gap-4 p-4">
            <Button variant={"outline"}>Info</Button>
            <div className="flex flex-row gap-4">
                <Select>
                    <SelectTrigger className="grow">
                        <SelectValue placeholder={"Chapter..."} />
                    </SelectTrigger>
                </Select>
                <Select>
                    <SelectTrigger className="grow">
                        <SelectValue placeholder={"Day..."} />
                    </SelectTrigger>
                </Select>
            </div>
            <Separator />
            <Markdown rehypePlugins={[rehypeRaw]}>{data.dayRecap}</Markdown>
        </Card>
    );
};

export default ViewGeneralCard;
