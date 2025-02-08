import { ImageNodeType } from "@/lib/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DEFAULT_NODE_IMAGE } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Return a lighter or darker version of a color, param is hex color
export function getLighterOrDarkerColor(color: string, percent: number) {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const B = ((num >> 8) & 0x00ff) + amt;
    const G = (num & 0x0000ff) + amt;
    const newColor = (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
        (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
        .toString(16)
        .slice(1);
    return `#${newColor}`;
}

export const extractImageSrcFromNodes = (
    nodes: ImageNodeType[],
): { [key: string]: string } => {
    return nodes.reduce((acc: { [key: string]: string }, node) => {
        acc[node.id] = node.data.imageSrc || DEFAULT_NODE_IMAGE;
        return acc;
    }, {});
};

export const getLineSvg = (style: React.CSSProperties, showMarker = false) => {
    const width = 60;
    const height = 20;
    const strokeColor = style?.stroke || "black";
    return (
        <svg width={width} height={height}>
            <defs>
                <marker
                    id={`markerArrow`}
                    viewBox="0 0 10 10"
                    refX="9" // Adjust reference point for correct positioning
                    refY="5" // Adjust to center the arrow on the line
                    markerWidth="4"
                    markerHeight="4"
                    className="stroke-[1]"
                    orient="auto-start-reverse" // Automatically orient the marker based on line direction
                >
                    <path d="M0,0 L10,5 L0,10 z" fill={strokeColor} />
                </marker>
            </defs>
            <line
                x1="0"
                y1="10"
                x2={width}
                y2="10"
                stroke={strokeColor}
                style={style}
                strokeWidth={4}
                markerEnd={showMarker ? "url(#markerArrow)" : ""}
            />
        </svg>
    );
};

export const urlToEmbedUrl = (url: string | null) => {
    if (!url) return { videoid: "", params: "" };

    let videoid = url.split("/live/")[1];
    if (videoid) {
        // example https://www.youtube.com/live/2ATTd32AV-Q?feature=shared&t=10481
        let params = videoid.split("?")[1];
        // replace t= with start=, cause YoutubeEmbed uses start= for timestamp (i think)
        params = params.replace("t=", "start=");
        videoid = videoid.split("?")[0];

        return { videoid, params };
    } else {
        return { videoid: "", params: "" };
    }
};
