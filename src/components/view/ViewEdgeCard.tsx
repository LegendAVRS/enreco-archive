import VaulDrawer from "@/components/view/VaulDrawer";
import ViewCard from "@/components/view/ViewCard";
import ViewEdgeContent from "@/components/view/ViewEdgeContent";
import { FixedEdgeType, ImageNodeType, Relationship } from "@/lib/type";
import { useReactFlow } from "@xyflow/react";
import { BrowserView, MobileView } from "react-device-detect";

import { cn } from "@/lib/utils";
import { EdgeLinkClickHandler, NodeLinkClickHandler } from "./ViewMarkdown";
import { X } from "lucide-react";

interface Props {
    isCardOpen: boolean;
    selectedEdge: FixedEdgeType | null;
    edgeRelationship: Relationship | null;
    onCardClose: () => void;
    onNodeLinkClicked: NodeLinkClickHandler;
    onEdgeLinkClicked: EdgeLinkClickHandler;
}

const ViewEdgeCard = ({
    isCardOpen,
    selectedEdge,
    edgeRelationship,
    onCardClose,
    onEdgeLinkClicked,
    onNodeLinkClicked,
}: Props) => {
    const { getNode } = useReactFlow();

    function onDrawerOpenChange(newOpenState: boolean): void {
        if (!newOpenState) {
            onCardClose();
        }
    }

    // If this card is not meant to be open, return nothing.
    if (!isCardOpen) {
        return;
    }

    // If selectedEdge is null but the card is meant to be visible, throw Error.
    if (!selectedEdge || !edgeRelationship) {
        throw new Error(
            "selectedEdge or edgeRelationship is null but the card is being shown!",
        );
    }

    // An edge always has a source and target node, which explains the !
    const nodeA: ImageNodeType = getNode(selectedEdge.source)! as ImageNodeType;
    const nodeB: ImageNodeType = getNode(selectedEdge.target)! as ImageNodeType;

    return (
        <>
            <BrowserView>
                <ViewCard
                    isCardOpen={isCardOpen}
                    className={cn("transition-all absolute", {
                        "opacity-0 -z-10 invisible": !isCardOpen,
                        "opacity-1 z-10 visible": isCardOpen,
                    })}
                >
                    <ViewEdgeContent
                        selectedEdge={selectedEdge}
                        edgeRelationship={edgeRelationship}
                        nodeA={nodeA}
                        nodeB={nodeB}
                        onEdgeLinkClicked={onEdgeLinkClicked}
                        onNodeLinkClicked={onNodeLinkClicked}
                    />
                    <X className="x-close" onClick={onCardClose} />
                </ViewCard>
            </BrowserView>
            <MobileView>
                <VaulDrawer
                    open={true}
                    onOpenChange={onDrawerOpenChange}
                    disableScrollablity={false}
                >
                    <div className="h-full flex flex-col gap-4 items-center">
                        <ViewEdgeContent
                            selectedEdge={selectedEdge}
                            edgeRelationship={edgeRelationship}
                            nodeA={nodeA}
                            nodeB={nodeB}
                            onEdgeLinkClicked={onEdgeLinkClicked}
                            onNodeLinkClicked={onNodeLinkClicked}
                        />
                    </div>
                </VaulDrawer>
            </MobileView>
        </>
    );
};

export default ViewEdgeCard;
