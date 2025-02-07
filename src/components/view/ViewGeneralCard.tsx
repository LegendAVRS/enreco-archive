import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { ChartData } from "@/lib/type";

interface Props {
    day: number;
    dayData: ChartData;
}

const ViewRecapCard = ({ day, dayData }: Props) => {
    return (
        <div className="flex flex-col gap-4 m-4 h-full">
            {/* Scrollable Content */}
            <div className="overflow-auto">
                <h2 className="mb-2">{`Day ${day + 1} Recap`}</h2>
                <Markdown className="overflow-auto" rehypePlugins={[rehypeRaw]}>
                    {dayData.dayRecap || "No content available."}
                </Markdown>
            </div>
        </div>
    );
};

export default ViewRecapCard;
