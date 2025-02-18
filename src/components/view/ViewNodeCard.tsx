import ViewCard from "@/components/view/ViewCard";

import VaulDrawer from "@/components/view/VaulDrawer";
import ViewNodeContent from "@/components/view/ViewNodeContent";
import { BrowserView, MobileView } from "react-device-detect";

import { cn } from "@/lib/utils";
import { ImageNodeType, Team } from "@/lib/type";
import { EdgeLinkClickHandler, NodeLinkClickHandler } from "./ViewMarkdown";
import { X } from "lucide-react";

interface Props {
    isCardOpen: boolean;
    selectedNode: ImageNodeType | null;
    nodeTeam: Team | null;
    chapter: number;
    onCardClose: () => void;
    onNodeLinkClicked: NodeLinkClickHandler;
    onEdgeLinkClicked: EdgeLinkClickHandler;
}

const ViewNodeCard = ({
    isCardOpen,
    selectedNode,
    nodeTeam,
    chapter,
    onCardClose,
    onNodeLinkClicked,
    onEdgeLinkClicked,
}: Props) => {
    function onDrawerOpenChange(newOpenState: boolean): void {
        if (!newOpenState) {
            onCardClose();
        }
    }

    const renderContent = selectedNode !== null && nodeTeam !== null;

    return (
        <>
            <BrowserView>
                <ViewCard
                    isCardOpen={isCardOpen}
                    className={cn(
                        "transition-all absolute flex flex-col items-center",
                        {
                            "opacity-0 -z-10 invisible": !isCardOpen,
                            "opacity-1 z-10 visible": isCardOpen,
                        },
                    )}
                >
                    {renderContent && (
                        <ViewNodeContent
                            onNodeLinkClicked={onNodeLinkClicked}
                            onEdgeLinkClicked={onEdgeLinkClicked}
                            selectedNode={selectedNode}
                            team={nodeTeam}
                            chapter={chapter}
                        />
                    )}
                    <X className="x-close" onClick={onCardClose} />
                </ViewCard>
            </BrowserView>
            <MobileView>
                <VaulDrawer
                    open={isCardOpen}
                    onOpenChange={onDrawerOpenChange}
                    disableScrollablity={false}
                >
                    <div className="flex-col flex items-center gap-4 max-h-full">
                        {renderContent && (
                            <ViewNodeContent
                                onNodeLinkClicked={onNodeLinkClicked}
                                onEdgeLinkClicked={onEdgeLinkClicked}
                                selectedNode={selectedNode}
                                team={nodeTeam}
                                chapter={chapter}
                            />
                        )}
                    </div>
                </VaulDrawer>
            </MobileView>
        </>
    );
};

export default ViewNodeCard;
