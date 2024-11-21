import { memo, useEffect, useMemo } from "react";
import { useChartStore } from "@/store/chartStore";
import { useViewStore } from "@/store/viewStore";
import {
    Handle,
    HandleType,
    Position,
    useUpdateNodeInternals,
} from "@xyflow/react";
import { ImageNodeProps } from "../../lib/type";
import Image from "next/image";
import { OLD_NODE_OPACITY } from "@/lib/constants";

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

const generateHandles = (numOfHandles: number) => [
    ...generateHandlesOnSide(Position.Top, "left", numOfHandles),
    ...generateHandlesOnSide(Position.Right, "top", numOfHandles),
    ...generateHandlesOnSide(Position.Bottom, "left", numOfHandles),
    ...generateHandlesOnSide(Position.Left, "top", numOfHandles),
];

const getVisibilityStyle = (visible: boolean, isNew: boolean) => {
    if (!visible) {
        return {
            opacity: 0,
            strokeWidth: 0,
        };
    }
    if (!isNew) {
        return {
            opacity: OLD_NODE_OPACITY,
        };
    }
    return {
        opacity: 1,
    };
};

const ViewImageNode = ({ data, id }: ImageNodeProps) => {
    const { teamVisibility, characterVisibility } = useViewStore();
    const { data: chartData } = useChartStore();

    // Generate handles only on mount since they’re static
    const handles = useMemo(() => generateHandles(NUM_OF_HANDLES), []);

    // Destructure edges from chartData and use it in `useMemo` hooks
    const { edges: chartEdges } = chartData;

    // Filter edges based on the current node ID
    const edges = useMemo(
        () =>
            chartEdges.filter(
                (edge) => edge.source === id || edge.target === id
            ),
        [id, chartEdges]
    );

    // Compute node visibility based on related edge and viewstore settings
    const nodeVisibility = useMemo(() => {
        let isVisible = true;
        if (data.team) isVisible = isVisible && teamVisibility[data.team];
        if (data.title)
            isVisible = isVisible && characterVisibility[data.title];
        return isVisible;
    }, [teamVisibility, characterVisibility, data.team, data.title]);

    const nodeVisibilityStyle = useMemo(
        () => getVisibilityStyle(nodeVisibility, data.new ? data.new : true),
        [nodeVisibility, data.new]
    );

    // Filter handles based on used edges
    const usedHandles = useMemo(() => {
        const usedHandleIds = edges.reduce((acc, edge) => {
            if (edge.source === id) acc.add(`${edge.sourceHandle}`);
            if (edge.target === id) acc.add(`${edge.targetHandle}`);
            return acc;
        }, new Set<string>());
        return handles.filter((handle) => usedHandleIds.has(handle.id));
    }, [edges, handles, id]);

    const updateNodeInternals = useUpdateNodeInternals();
    const handleElements = useMemo(
        () =>
            usedHandles.map((handle) => (
                <Handle
                    key={handle.key}
                    id={handle.id}
                    type={handle.type}
                    position={handle.position}
                    style={{ ...handle.style, opacity: "0.001" }}
                    isConnectable={true}
                />
            )),
        [usedHandles]
    );

    // Update node internals with debounced effect
    useEffect(() => {
        updateNodeInternals(id);
    }, [id, usedHandles, updateNodeInternals]);

    return (
        <>
            {handleElements}
            <div
                style={nodeVisibilityStyle}
                className="transition-all relative cursor-pointer overflow-hidden w-[100px] h-[100px] rounded"
            >
                <Image
                    className="aspect-square object-cover rounded-lg transition-transform duration-300 ease-in-out transform scale-100 hover:scale-110"
                    src={data.imageSrc || ""}
                    width={100}
                    height={100}
                    alt="character node"
                />
                {data.team && chartData.teams[data.team].imageSrc && (
                    <Image
                        className="absolute top-1 left-1 opacity-80"
                        width={25}
                        height={25}
                        src={chartData.teams[data.team].imageSrc || ""}
                        alt="team icon"
                    />
                )}
            </div>
        </>
    );
};

export default memo(ViewImageNode);
