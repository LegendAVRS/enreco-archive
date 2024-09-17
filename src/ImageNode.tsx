import { Handle, Position } from "@xyflow/react";
import { Node } from "./libs/type";

// Spread the handlers throughout the node based on the number of sources and targets
const ImageNode = ({ data }: Node) => {
    return (
        <>
            {Array.from({ length: data.numOfTargets }).map((_, index) => (
                <Handle
                    key={index}
                    id={`target-${index}`}
                    type="target"
                    position={Position.Bottom}
                    style={{ background: "#555" }}
                />
            ))}
            {Array.from({ length: data.numOfSources }).map((_, index) => (
                <Handle
                    key={index}
                    id={`source-${index}`}
                    type="source"
                    position={Position.Top}
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
