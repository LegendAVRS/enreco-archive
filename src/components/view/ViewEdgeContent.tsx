import { Separator } from "@/components/ui/separator";
import useEdgeStyle from "@/hooks/useEdgeStyle";
import { CustomEdgeType, ImageNodeType } from "@/lib/type";
import { getLineSvg } from "@/lib/utils";
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

    return (
        <>
            <div className="flex flex-row gap-4 items-center justify-between">
                <img
                    className="aspect-square w-[100px] object-cover"
                    src={nodeA.data.imageSrc}
                />
                {getLineSvg(edgeStyle!, selectedEdge.data?.marker)}
                <img
                    className="aspect-square w-[100px] object-cover"
                    src={nodeB.data.imageSrc}
                />
            </div>
            {selectedEdge.data?.title && (
                <span className="font-semibold">{selectedEdge.data.title}</span>
            )}
            <Separator />

            <div className="flex flex-col items-center">
                <span className="text-sm underline underline-offset-2">
                    Relationship: {selectedEdge.data?.relationship}
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
