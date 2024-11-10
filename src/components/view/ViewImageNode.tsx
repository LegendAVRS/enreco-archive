import { useEffect, useMemo } from "react";
import { useChartStore } from "@/store/chartStore";
import { useViewStore } from "@/store/viewStore";
import {
    Handle,
    HandleType,
    Position,
    useUpdateNodeInternals,
} from "@xyflow/react";
import { ImageNodeProps } from "../../lib/type";

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

const getImageVisibilityStyle = (visible: boolean) => ({
    opacity: visible ? 1 : 0.2,
});

const ViewImageNode = ({ data, id }: ImageNodeProps) => {
    const { edgeVisibility, teamVisibility, characterVisibility } =
        useViewStore();
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
        let isVisible = edges.some((edge) =>
            edge.data?.relationship
                ? edgeVisibility[edge.data.relationship]
                : true
        );
        if (data.team) isVisible = isVisible && teamVisibility[data.team];
        if (data.title)
            isVisible = isVisible && characterVisibility[data.title];
        return isVisible;
    }, [
        edges,
        edgeVisibility,
        teamVisibility,
        characterVisibility,
        data.team,
        data.title,
    ]);

    const nodeVisibilityStyle = useMemo(
        () => getImageVisibilityStyle(nodeVisibility),
        [nodeVisibility]
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
            <div className="relative overflow-hidden w-[100px] h-[100px] rounded">
                <img
                    className="cursor-pointer aspect-square object-cover rounded-lg transition-transform duration-300 ease-in-out transform scale-100 hover:scale-110"
                    src={data.imageSrc}
                    style={nodeVisibilityStyle}
                />
            </div>
        </>
    );
};

export default ViewImageNode;
