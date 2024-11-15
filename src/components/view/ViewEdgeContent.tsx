import { Separator } from "@/components/ui/separator";
import EdgeCardDeco from "@/components/view/EdgeCardDeco";
import useEdgeStyle from "@/hooks/useEdgeStyle";
import { CustomEdgeType, ImageNodeType } from "@/lib/type";
import { getLighterOrDarkerColor, getLineSvg } from "@/lib/utils";
import Markdown from "react-markdown";

interface ViewEdgeContentProps {
    selectedEdge: CustomEdgeType;
    nodeA: ImageNodeType;
    nodeB: ImageNodeType;
}

const ViewEdgeContent = ({
    selectedEdge,
    nodeA,
    nodeB,
}: ViewEdgeContentProps) => {
    const { edgeStyle } = useEdgeStyle(selectedEdge?.data?.relationship);
    const backgroundColor = getLighterOrDarkerColor(
        edgeStyle?.stroke || "",
        30
    );

    return (
        <>
            <div className="z-10 flex flex-row gap-4 items-center justify-between">
                <img
                    className="aspect-square w-[150px] object-cover"
                    src={nodeA.data.imageSrc}
                />
                {getLineSvg(edgeStyle!, selectedEdge.data?.marker)}
                <img
                    className="aspect-square w-[150px] object-cover"
                    src={nodeB.data.imageSrc}
                />
            </div>
            <EdgeCardDeco color={backgroundColor} />

            {selectedEdge.data?.title && (
                <span className="font-semibold">{selectedEdge.data.title}</span>
            )}
            <Separator />

            <div className="flex flex-col items-center">
                <span className="">
                    Relationship:{" "}
                    <span className=" underline underline-offset-2">
                        {selectedEdge.data?.relationship}
                    </span>
                </span>
            </div>
            <Separator />

            <div className="overflow-y-auto">
                <Markdown>
                    {selectedEdge.data && selectedEdge.data.content}
                </Markdown>
                <Separator />

                <figure>
                    <iframe
                        src={selectedEdge.data?.timestampUrl}
                        width={"100%"}
                    />
                    <figcaption className="text-center italic">
                        Timestamp for event
                    </figcaption>
                </figure>
            </div>
        </>
    );
};

export default ViewEdgeContent;
