import { Separator } from "@/components/ui/separator";
import ViewCard from "@/components/view/ViewCard";
import { getLighterOrDarkerColor } from "@/lib/utils";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useViewStore } from "@/store/viewStore";
import { extractColors } from "extract-colors";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { BrowserView, MobileView } from "react-device-detect";
import VaulDrawer from "@/components/view/VaulDrawer";

const ViewNodeCard = () => {
    const { selectedNode } = useFlowStore();
    const { data } = useChartStore();
    const { setCurrentCard } = useViewStore();

    const characterImageRef = useRef<HTMLImageElement>(null);
    const [color, setColor] = useState<string | null>(null);
    const [open, setOpen] = useState(true);
    useEffect(() => {
        setOpen(true);
        if (characterImageRef.current) {
            extractColors(characterImageRef.current).then((colors) => {
                const dominantColor = colors.reduce((prev, current) =>
                    prev.area > current.area ? prev : current
                );
                setColor(getLighterOrDarkerColor(dominantColor.hex, 40));
            });
        }
    }, [selectedNode]);

    return (
        <>
            <BrowserView>
                <ViewCard className="flex flex-col items-center">
                    <X
                        className="absolute top-5 right-5 cursor-pointer "
                        onClick={() => setCurrentCard(null)}
                    />
                    <div
                        className="absolute top-0 w-full h-[100px] -z-10"
                        style={{ backgroundColor: color || "" }}
                    />
                    <div
                        className="absolute top-[110px]  w-full h-[5px] -z-10"
                        style={{ backgroundColor: color || "" }}
                    />

                    {selectedNode?.data.team && (
                        <img
                            src={data.teams[selectedNode?.data.team].imgSrc}
                            className="absolute top-2 right-2 z-10"
                        />
                    )}

                    <img
                        src={selectedNode?.data.imageSrc}
                        className="aspect-square w-[150px]"
                        ref={characterImageRef}
                    />
                    <div className="font-semibold">
                        {selectedNode?.data.title}
                    </div>
                    <Separator />
                    <div className="flex flex-row justify-around w-full">
                        <div className="flex flex-col items-center">
                            <div className="font-semibold">Team</div>
                            <div>{selectedNode?.data.team}</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="font-semibold">Status</div>
                            <div>Alive</div>
                        </div>
                    </div>
                    <Separator />
                    <div className="overflow-auto max-h-[10%]">
                        <Markdown rehypePlugins={[rehypeRaw]}>
                            {selectedNode?.data.content}
                        </Markdown>
                    </div>
                </ViewCard>
            </BrowserView>
            <MobileView>
                <VaulDrawer open={open} setOpen={setOpen}>
                    <div className="flex flex-col items-center p-4 max-h-full">
                        <X
                            className="absolute top-5 right-5 cursor-pointer "
                            onClick={() => setCurrentCard(null)}
                        />
                        <div
                            className="absolute top-0 w-full h-[100px] -z-10"
                            style={{ backgroundColor: color || "" }}
                        />
                        <div
                            className="absolute top-[110px]  w-full h-[5px] -z-10"
                            style={{ backgroundColor: color || "" }}
                        />

                        {selectedNode?.data.team && (
                            <img
                                src={data.teams[selectedNode?.data.team].imgSrc}
                                className="absolute top-2 right-2 z-10"
                            />
                        )}

                        <img
                            src={selectedNode?.data.imageSrc}
                            className="aspect-square w-[150px]"
                            ref={characterImageRef}
                        />
                        <div className="font-semibold">
                            {selectedNode?.data.title}
                        </div>
                        <Separator />
                        <div className="flex flex-row justify-around w-full">
                            <div className="flex flex-col items-center">
                                <div className="font-semibold">Team</div>
                                <div>{selectedNode?.data.team}</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="font-semibold">Status</div>
                                <div>Alive</div>
                            </div>
                        </div>
                        <Separator />
                        <div className="overflow-auto max-h-[10%]">
                            <Markdown rehypePlugins={[rehypeRaw]}>
                                {selectedNode?.data.content +
                                    selectedNode?.data.content}
                            </Markdown>
                        </div>
                    </div>
                </VaulDrawer>
            </MobileView>
        </>
    );
};

export default ViewNodeCard;
