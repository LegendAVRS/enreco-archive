import { Handle, Position } from "@xyflow/react";
import { ImageNodeType } from "../lib/type";
import { useChartContext } from "@/context/useChartContext";

interface Props {
    data: ImageNodeType["data"];
}

const getVisibilityStyle = (
    guild: string,
    guildVisibilities: Record<string, boolean>
) => {
    const opacity = guildVisibilities[guild] ? "1" : "0.3";
    return {
        opacity,
    };
};

const ImageNode = ({ data }: Props) => {
    const { guildVisibilities } = useChartContext();
    const visibilityStyle = getVisibilityStyle(data.guild, guildVisibilities);
    return (
        <>
            {data.sourceHandles.map((handle) => (
                <Handle
                    key={handle.id}
                    id={handle.id}
                    type="source"
                    position={Position.Top}
                    style={{ background: "#555" }}
                />
            ))}

            {data.targetHandles.map((handle) => (
                <Handle
                    key={handle.id}
                    id={handle.id}
                    type="target"
                    position={Position.Bottom}
                    style={{ background: "#555" }}
                />
            ))}

            <img
                className="aspect-square object-cover rounded-lg transition-all"
                width={100}
                src={data.imageSrc}
                style={visibilityStyle}
            />
        </>
    );
};

export default ImageNode;
