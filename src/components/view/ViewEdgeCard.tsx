import VaulDrawer from "@/components/view/VaulDrawer";
import ViewCard from "@/components/view/ViewCard";
import ViewEdgeContent from "@/components/view/ViewEdgeContent";
import { ImageNodeType } from "@/lib/type";
import { useFlowStore } from "@/store/flowStore";
import { useViewStore } from "@/store/viewStore";
import { useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ViewEdgeCard = () => {
    const { selectedEdge } = useFlowStore();
    const { getNode } = useReactFlow();
    const { setCurrentCard, currentCard } = useViewStore();
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (currentCard === "edge") {
            setOpen(true);
        }
    }, [selectedEdge, currentCard]);

    if (!selectedEdge) return null;

    // An edge always has a source and target node, which explains the !
    const nodeA: ImageNodeType = getNode(selectedEdge.source)! as ImageNodeType;
    const nodeB: ImageNodeType = getNode(selectedEdge.target)! as ImageNodeType;

    return (
        <>
            <BrowserView>
                <ViewCard
                    className={cn("transition-all absolute", {
                        "opacity-0 z-0 invisible": currentCard !== "edge",
                        "opacity-1 z-10 visible": currentCard === "edge",
                    })}
                >
                    <X
                        className="absolute top-5 right-5 cursor-pointer "
                        onClick={() => setCurrentCard(null)}
                    />
                    <ViewEdgeContent
                        selectedEdge={selectedEdge}
                        nodeA={nodeA}
                        nodeB={nodeB}
                    />
                </ViewCard>
            </BrowserView>
            <MobileView>
                <VaulDrawer
                    open={open}
                    setOpen={setOpen}
                    onClose={() => setCurrentCard(null)}
                >
                    <div className="h-full flex flex-col gap-4 items-center">
                        <ViewEdgeContent
                            selectedEdge={selectedEdge}
                            nodeA={nodeA}
                            nodeB={nodeB}
                        />
                    </div>
                </VaulDrawer>
            </MobileView>
        </>
    );
};

export default ViewEdgeCard;
