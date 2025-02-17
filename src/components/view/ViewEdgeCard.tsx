import VaulDrawer from "@/components/view/VaulDrawer";
import ViewCard from "@/components/view/ViewCard";
import ViewEdgeContent from "@/components/view/ViewEdgeContent";
import { FixedEdgeType, ImageNodeType, Relationship } from "@/lib/type";
import { useReactFlow } from "@xyflow/react";
import { BrowserView, MobileView } from "react-device-detect";

import { cn } from "@/lib/utils";
import { EdgeLinkClickHandler, NodeLinkClickHandler } from "./ViewMarkdown";

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

    // An edge always has a source and target node, which explains the !
    const nodeA = selectedEdge ? getNode(selectedEdge.source)! as ImageNodeType : null;
    const nodeB = selectedEdge ? getNode(selectedEdge.target)! as ImageNodeType : null;

    const renderContent = selectedEdge !== null && 
        edgeRelationship !== null &&
        nodeA !== null &&
        nodeB !== null;

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
                    { renderContent &&
                        <ViewEdgeContent
                            selectedEdge={selectedEdge}
                            edgeRelationship={edgeRelationship}
                            nodeA={nodeA}
                            nodeB={nodeB}
                            onEdgeLinkClicked={onEdgeLinkClicked}
                            onNodeLinkClicked={onNodeLinkClicked}
                        />
                    }
                </ViewCard>
            </BrowserView>
            <MobileView>
                <VaulDrawer
                    open={true}
                    onOpenChange={onDrawerOpenChange}
                    disableScrollablity={false}
                >
                    <div className="h-full flex flex-col gap-4 items-center">
                        { renderContent &&
                            <ViewEdgeContent
                                selectedEdge={selectedEdge}
                                edgeRelationship={edgeRelationship}
                                nodeA={nodeA}
                                nodeB={nodeB}
                                onEdgeLinkClicked={onEdgeLinkClicked}
                                onNodeLinkClicked={onNodeLinkClicked}
                            />
                        }
                    </div>
                </VaulDrawer>
            </MobileView>
        </>
    );
};

export default ViewEdgeCard;
