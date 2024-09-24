import { Handle, Position } from "@xyflow/react";
import { ImageNodeType } from "../lib/type";

// Spread the handlers throughout the node based on the number of sources and targets

interface Props {
    data: ImageNodeType["data"];
}

const ImageNode = ({ data }: Props) => {
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
