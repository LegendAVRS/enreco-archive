import { useEditorStore } from "@/store/editorStore";
import {
    Handle,
    HandleType,
    Position,
    useUpdateNodeInternals,
} from "@xyflow/react";
import { useEffect, useState } from "react";
import { ImageNodeProps } from "../../lib/type";
import { useViewStore } from "@/store/viewStore";
import { useChartStore } from "@/store/chartStore";

// Number of handles per side
const NUM_OF_HANDLES = 5;

const generateHandlesOnSide = (
    position: Position,
    positionStyle: "left" | "top",
    numOfHandles: number
) => {
    const handles = [];
    const step = 100 / numOfHandles;
    const halfStep = step / 2;
    let space = 0;
    for (let i = 0; i < numOfHandles; i++) {
        space += i === 0 ? halfStep : step;
        handles.push({
            key: `${position}-${i}`,
            id: `${position}-${i}`,
            type: "source" as HandleType,
            position: position,
            style: {
                [positionStyle]: `${space}%`,
            },
            isConnected: false,
        });
    }
    return handles;
};
// Generate node handles, spread on all 4 sides
const generateHandles = (numOfHandles: number) => {
    const handles = [];
    handles.push(...generateHandlesOnSide(Position.Top, "left", numOfHandles));
    handles.push(...generateHandlesOnSide(Position.Right, "top", numOfHandles));
    handles.push(
        ...generateHandlesOnSide(Position.Bottom, "left", numOfHandles)
    );
    handles.push(...generateHandlesOnSide(Position.Left, "top", numOfHandles));

    return handles;
};

const getImageVisibilityStyle = (visible: boolean) => {
    return {
        opacity: visible ? 1 : 0.2,
    };
};

const ImageNode = ({ data, id }: ImageNodeProps) => {
    // const { showHandles } = useEditorStore();
    const [handles, setHandles] = useState(generateHandles(NUM_OF_HANDLES));
    const { edgeVisibility, teamVisibility, characterVisibility } =
        useViewStore();
    const { data: chartData } = useChartStore();

    // get edges that have either source or target as this node
    const edges = chartData.edges.filter(
        (edge) => edge.source === id || edge.target === id
    );

    // loop thourgh edges and check if they are there exists one edge that is visible
    const nodeVisibility =
        edges.some((edge) => edgeVisibility[edge.data.relationship]) &&
        teamVisibility[data.team] &&
        characterVisibility[data.title];

    const nodeVisibilityStyle = getImageVisibilityStyle(nodeVisibility);

    const updateNodeInternals = useUpdateNodeInternals();
    const handleElements = handles.map((handle) => (
        <Handle
            key={handle.key}
            id={handle.id}
            type={handle.type}
            position={handle.position}
            // Setting opacity to complete 0 cause some weird stuffff to happen
            style={{ ...handle.style, opacity: "0.001" }}
            isConnectable={true}
        />
    ));
    useEffect(() => {
        updateNodeInternals(id);
    }, [handles, id, updateNodeInternals]);
    return (
        <>
            {handleElements}
            <img
                className="aspect-square object-cover rounded-lg transition-all"
                width={100}
                src={data.imageSrc}
                style={{ ...nodeVisibilityStyle }}
            />
        </>
    );
};

export default ImageNode;
