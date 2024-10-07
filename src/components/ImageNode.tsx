import {
    Handle,
    HandleType,
    Position,
    useUpdateNodeInternals,
} from "@xyflow/react";
import { useEffect, useState } from "react";
import { ImageNodeType } from "../lib/type";

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

const ImageNode = ({ data, id }: ImageNodeType) => {
    const [handles, setHandles] = useState(generateHandles(NUM_OF_HANDLES));
    const updateNodeInternals = useUpdateNodeInternals();
    const handleElements = handles.map((handle) => (
        <Handle
            key={handle.key}
            id={handle.id}
            type={handle.type}
            position={handle.position}
            style={handle.style}
            onConnect={() => {
                setHandles((prev) =>
                    prev.map((h) =>
                        h.id === handle.id ? { ...h, isConnected: true } : h
                    )
                );
            }}
        />
    ));
    useEffect(() => {
        updateNodeInternals(id);
    }, [handles, id]);
    return (
        <>
            {handleElements}
            <div>
                <img
                    className="aspect-square object-cover rounded-lg"
                    width={100}
                    src={data.imageSrc}
                />
            </div>
        </>
    );
};

export default ImageNode;
