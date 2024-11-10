import ViewCard from "@/components/view/ViewCard";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useViewStore } from "@/store/viewStore";
import { useEffect, useState } from "react";

import VaulDrawer from "@/components/view/VaulDrawer";
import ViewNodeContent from "@/components/view/ViewNodeContent";
import { BrowserView, MobileView } from "react-device-detect";

import { X } from "lucide-react";

const ViewNodeCard = () => {
    const { selectedNode } = useFlowStore();
    const { data } = useChartStore();
    const { setCurrentCard } = useViewStore();
    const [open, setOpen] = useState(true);

    useEffect(() => {
        setOpen(true);
    }, [selectedNode]);

    return (
        <>
            <BrowserView>
                <ViewCard className="flex flex-col items-center">
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
