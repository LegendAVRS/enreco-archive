import ClickableBaseEdge from "@/components/CustomBaseEdge";
import { getSmoothStepPath } from "@/components/smoothStep";
import useEdgeStyle from "@/hooks/useEdgeStyle";
import { CustomEdgeProps } from "@/lib/type";
import { useReactFlow } from "@xyflow/react";

type Segment = {
    edgePath: string;
    labelX: number;
    labelY: number;
};

export default function PositionableEdge({
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
    id,
    markerEnd,
    markerStart,
    source,
    target,
    sourcePosition,
    targetPosition,
}: CustomEdgeProps) {
    const { edgeStyle } = useEdgeStyle(data?.relationship);
    // const [path] = getSmoothStepPath({
    //     sourceX,
    //     sourceY,
    //     targetX,
    //     targetY,
    // });

    const reactFlowInstance = useReactFlow();
    const positionHandlers = data?.positionHandlers || [];
    const edgeSegmentsCount = positionHandlers.length + 1;
    let edgeSegmentsArray: Segment[] = [];

    for (let i = 0; i < edgeSegmentsCount; i++) {
        let segmentSourceX, segmentSourceY, segmentTargetX, segmentTargetY;

        if (i === 0) {
            segmentSourceX = sourceX;
            segmentSourceY = sourceY;
        } else {
            const handler = positionHandlers[i - 1];
            segmentSourceX = handler.x;
            segmentSourceY = handler.y;
        }

        if (i === edgeSegmentsCount - 1) {
            segmentTargetX = targetX;
            segmentTargetY = targetY;
        } else {
            const handler = positionHandlers[i];
            segmentTargetX = handler.x;
            segmentTargetY = handler.y;
        }

        const [edgePath, labelX, labelY] = getSmoothStepPath({
            sourceX: segmentSourceX,
            sourceY: segmentSourceY,
            sourcePosition,
            targetX: segmentTargetX,
            targetY: segmentTargetY,
            targetPosition,
            borderRadius: 0,
        });

        // if i is not last segment, remove second Q from svg path
        // Example: "M110 97L 110,77Q 110,77 110,77L 200,77Q 200,77 200,77L200 97L200 100
        // Becomes: "M110 97L 110,77L 200,77L200 97L200 100

        if (i < edgeSegmentsCount - 1) {
            const firstQIndex = edgePath.indexOf("Q");
            const secondQIndex = edgePath.indexOf("Q", firstQIndex + 1);
            const pathWithoutSecondQ = edgePath.slice(0, secondQIndex);
            edgeSegmentsArray.push({
                edgePath: pathWithoutSecondQ,
                labelX,
                labelY,
            });
        } else {
            edgeSegmentsArray.push({ edgePath, labelX, labelY });
        }
    }

    const addPositionHandler = (
        clientX: number,
        clientY: number,
        index: number
    ) => {
        let position = reactFlowInstance.screenToFlowPosition({
            x: clientX,
            y: clientY,
        });
        position.y = 77;
        console.log("position", position);
        reactFlowInstance.setEdges((edges) => {
            const edgeIndex = edges.findIndex((edge) => edge.id === id);

            // @ts-expect-error Define type later, red lines annoying
            edges[edgeIndex].data.positionHandlers.splice(index, 0, {
                x: position.x,
                y: position.y,
            });
            return edges;
        });
    };

    // Returns new edgeSegmentsArray with all segments combined into one path
    const combineSegmentsIntoOnePath = (edgeSegmentsArray: Segment[]) => {
        // Path 1: M110 97L 110,82Q 110,77 115,77L 195,77Q 200,77 200,82L200 97L200 100
        // Path 2: M200 100L200 97L 200,82Q 200,77 205,77L 305,77Q 310,77 310,82L310 97
        // So combined path should be:
        // M110 97L 110,82Q 110,77 115,77L 195,77Q 200,77 200,82L200 97L200 100L200 97L 200,82Q 200,77 205,77L 305,77Q 310,77 310,82L310 97

        const combinedPath: Segment[] = [];
        edgeSegmentsArray.forEach((segment, index) => {
            const { edgePath } = segment;
            if (index === 0) {
                combinedPath.push(segment);
            } else {
                // find first character different from M
                const firstCharIndex = edgePath.indexOf("L");
                const pathWithoutM = edgePath.slice(firstCharIndex);
                combinedPath[0].edgePath += pathWithoutM;
            }
        });
        return combinedPath;
    };

    // edgeSegmentsArray = combineSegmentsIntoOnePath(edgeSegmentsArray);

    console.log("edgeSegmentsArray", edgeSegmentsArray);
    return (
        <>
            {edgeSegmentsArray.map((segment, index) => (
                <ClickableBaseEdge
                    key={index}
                    path={segment.edgePath}
                    style={edgeStyle}
                    onClick={(e) => {
                        addPositionHandler(e.clientX, e.clientY, index);
                    }}
                    id={id}
                    markerEnd={markerEnd}
                    markerStart={markerStart}
                    sourceX={sourceX}
                    sourceY={sourceY}
                    source={source}
                    target={target}
                    targetX={targetX}
                    targetY={targetY}
                    sourcePosition={sourcePosition}
                    targetPosition={targetPosition}
                />
            ))}
        </>
    );
}
