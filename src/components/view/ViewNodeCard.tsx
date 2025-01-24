import ViewCard from "@/components/view/ViewCard";

import VaulDrawer from "@/components/view/VaulDrawer";
import ViewNodeContent from "@/components/view/ViewNodeContent";
import { BrowserView, MobileView } from "react-device-detect";

import { cn } from "@/lib/utils";
import { ImageNodeType, Team } from "@/lib/type";
import { EdgeLinkClickHandler, NodeLinkClickHandler } from "./ViewMarkdown";

interface Props {
    isCardOpen: boolean;
    selectedNode: ImageNodeType | null;
    nodeTeam: Team | null;
    onCardClose: () => void;
    onNodeLinkClicked: NodeLinkClickHandler;
    onEdgeLinkClicked: EdgeLinkClickHandler;
};

const ViewNodeCard = ({ isCardOpen, selectedNode, nodeTeam, onCardClose, onNodeLinkClicked, onEdgeLinkClicked }: Props) => {
    function onDrawerOpenChange(newOpenState: boolean): void {
        if(!newOpenState) {
            onCardClose();
        }
    }

    // If this card is not meant to be open, return nothing.
    if(!isCardOpen) {
        return;
    }

    // If selectedNode is null but the card is meant to be visible, throw Error.
    if(!selectedNode || !nodeTeam) {
        throw new Error("selectedNode or nodeTeam is null but the card is being shown!");
    }

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
                        }
                    )}
                >
                    <ViewNodeContent
                        onNodeLinkClicked={onNodeLinkClicked}
                        onEdgeLinkClicked={onEdgeLinkClicked} 
                        selectedNode={selectedNode} 
                        team={nodeTeam}
                    />
                </ViewCard>
            </BrowserView>
            <MobileView>
                <VaulDrawer open={true} onOpenChange={onDrawerOpenChange} disableScrollablity={false} >
                    <div className="flex-col flex items-center gap-4 max-h-full">
                        <ViewNodeContent
                            onNodeLinkClicked={onNodeLinkClicked}
                            onEdgeLinkClicked={onEdgeLinkClicked} 
                            selectedNode={selectedNode} 
                            team={nodeTeam}
                        />
                    </div>
                </VaulDrawer>
            </MobileView>
        </>
    );
};

export default ViewNodeCard;
