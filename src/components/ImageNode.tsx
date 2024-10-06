import { ImageNodeType } from "../lib/type";

// Spread the handlers throughout the node based on the number of sources and targets

interface Props {
    data: ImageNodeType["data"];
}

const ImageNode = ({ data }: Props) => {
    return (
        <>
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
