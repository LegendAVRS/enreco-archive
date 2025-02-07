import {
    EdgeLinkClickHandler,
    NodeLinkClickHandler,
    ViewMarkdown,
} from "@/components/view/ViewMarkdown";
import { ChartData } from "@/lib/type";

interface Props {
    dayData: ChartData;

    onNodeLinkClicked: NodeLinkClickHandler;
    onEdgeLinkClicked: EdgeLinkClickHandler;
}

const ViewRecapCard = ({
    dayData,
    onNodeLinkClicked,
    onEdgeLinkClicked,
}: Props) => {
    return (
        <div className="flex flex-col gap-4 m-4 h-full">
            {/* Scrollable Content */}
            <div className="overflow-auto">
                <ViewMarkdown
                    onNodeLinkClicked={onNodeLinkClicked}
                    onEdgeLinkClicked={onEdgeLinkClicked}
                >
                    {dayData.dayRecap || "No content available."}
                </ViewMarkdown>
            </div>
        </div>
    );
};

export default ViewRecapCard;
