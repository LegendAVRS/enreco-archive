import ViewCard from "@/components/view/ViewCard";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useViewStore } from "@/store/viewStore";
import { useEffect, useState } from "react";

import VaulDrawer from "@/components/view/VaulDrawer";
import ViewNodeContent from "@/components/view/ViewNodeContent";
import { BrowserView, MobileView } from "react-device-detect";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ViewNodeCard = () => {
    const { selectedNode } = useFlowStore();
    const { data } = useChartStore();
    const { setCurrentCard, currentCard } = useViewStore();
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (currentCard === "node") {
            setOpen(true);
        }
    }, [currentCard]);

    if (!selectedNode) {
        return null;
    }
    return (
        <>
            <BrowserView>
                <ViewCard
                    className={cn(
                        "transition-all absolute flex flex-col items-center",
                        {
                            "opacity-0 z-0 invisible": currentCard !== "node",
                            "opacity-1 z-10 visible": currentCard === "node",
                        }
                    )}
                >
                    <X
                        className="absolute top-5 right-5 cursor-pointer "
                        onClick={() => setCurrentCard(null)}
                    />
                    <ViewNodeContent selectedNode={selectedNode} data={data} />
                </ViewCard>
            </BrowserView>
            <MobileView>
                <VaulDrawer open={open} setOpen={setOpen}>
                    <div className="flex-col flex items-center gap-4 max-h-full">
                        <ViewNodeContent
                            selectedNode={selectedNode}
                            data={data}
                        />
                    </div>
                </VaulDrawer>
            </MobileView>
        </>
    );
};

export default ViewNodeCard;
