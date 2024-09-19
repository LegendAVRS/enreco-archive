import { uniqueId } from "lodash";
import { useEffect } from "react";
import {
    Handle,
    HandleType,
    Position,
    useUpdateNodeInternals,
} from "reactflow";

const getHandlePosition = (index: number) => {
    switch (index % 4) {
        case 0:
            return Position.Top;
        case 1:
            return Position.Right;
        case 2:
            return Position.Bottom;
        case 3:
            return Position.Left;
        default:
            return Position.Top;
    }
};

/**
 * Generates handles for the node based on the number of sources and targets
 * The handles are distributed evenly on the top, right, bottom, and left side of the node
 */
const generateHandles = (numOfTargets: number, numOfSources: number) => {
    const positionCount = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };

    for (let i = 0; i < numOfTargets + numOfSources; i++) {
        const position = getHandlePosition(i);
        positionCount[position]++;
    }

    const handles = [];
    let currentNumOfSources = numOfSources;
    let currentNumOfTargets = numOfTargets;
    for (const [position, count] of Object.entries(positionCount)) {
        let translateStyle = "left";
        if (position === "right" || position === "left") {
            translateStyle = "top";
        }
        const step = 100 / count;
        const halfStep = step / 2;
        let space = 0;
        let currentStepIndex = 0;
        let currentNumOfHandles = count;
        while (currentNumOfHandles > 0 && currentNumOfSources > 0) {
            if (currentStepIndex === 0) {
                space += halfStep;
            } else {
                space += step;
            }
            handles.push({
                id: `source-handle-${currentNumOfSources}`,
                type: "source" as HandleType,
                position: position as Position,
                style: {
                    background: "#555",
                    [translateStyle]: space,
                },
            });
            --currentNumOfHandles;
            --currentNumOfSources;
            ++currentStepIndex;
        }

        while (currentNumOfHandles > 0 && currentNumOfTargets > 0) {
            if (currentStepIndex === 0) {
                space += halfStep;
            } else {
                space += step;
            }
            handles.push({
                id: `target-handle-${currentNumOfTargets}`,
                type: "target" as HandleType,
                position: position as Position,
                style: {
                    background: "#555",
                    [translateStyle]: space,
                },
            });
            --currentNumOfHandles;
            --currentNumOfTargets;
            ++currentStepIndex;
        }
    }

    return handles;
};

const ImageNode = ({ id, data }) => {
    const handles = generateHandles(data.numOfTargets, data.numOfSources);
    const updateNodeInternals = useUpdateNodeInternals();
    const handleElements = handles.map((handle) => (
        <Handle
            key={uniqueId()}
            id={handle.id}
            type={handle.type}
            position={handle.position}
            style={handle.style}
        />
    ));
    useEffect(() => {
        updateNodeInternals(id);
    }, [id, updateNodeInternals]);

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
