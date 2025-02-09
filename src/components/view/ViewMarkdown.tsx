import { FixedEdgeType, ImageNodeType } from "@/lib/type";
import { useSettingStore } from "@/store/settingStore";
import { useViewStore } from "@/store/viewStore";
import { useReactFlow } from "@xyflow/react";
import {
    Children,
    cloneElement,
    isValidElement,
    MouseEventHandler,
    ReactNode,
    MouseEvent,
} from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export type NodeLinkClickHandler = (targetNode: ImageNodeType) => void;
export type EdgeLinkClickHandler = (targetEdge: FixedEdgeType) => void;

interface Props {
    onNodeLinkClicked: NodeLinkClickHandler;
    onEdgeLinkClicked: EdgeLinkClickHandler;
    children: string | null | undefined;
}

/*
Wraps react-markdown while transforming links with a special href value to jump to specific nodes/edges.
All other links are transformed to open in a new tab.

You can generate these special links by using the following markdown: 
For a link to jump to a specific node: [node link](#node:<node id>)
For a link to jump to a specific edge: [edge link](#edge:<edge id>)
*/
export function ViewMarkdown({
    onNodeLinkClicked,
    onEdgeLinkClicked,
    children,
}: Props) {
    const { getNode, getEdge } = useReactFlow<ImageNodeType, FixedEdgeType>();
    const viewStore = useViewStore();
    const settingStore = useSettingStore();

    const nodeLinkHandler: MouseEventHandler<HTMLAnchorElement> = (
        event: MouseEvent<HTMLAnchorElement>,
    ) => {
        event.preventDefault();

        const nodeId =
            (event.target as Element).getAttribute("data-node-id") || "";
        const targetNode: ImageNodeType | undefined = getNode(nodeId);
        if (!targetNode) {
            return;
        }

        onNodeLinkClicked(targetNode);
    };

    const edgeLinkHandler: MouseEventHandler<HTMLAnchorElement> = (
        event: MouseEvent<HTMLAnchorElement>,
    ) => {
        event.preventDefault();

        const edgeId =
            (event.target as Element).getAttribute("data-edge-id") || "";
        const targetEdge: FixedEdgeType | undefined = getEdge(edgeId);
        if (!targetEdge) {
            return;
        }

        onEdgeLinkClicked(targetEdge);
    };

    const timestampHandler: MouseEventHandler<HTMLAnchorElement> = async (
        event: MouseEvent<HTMLAnchorElement>,
    ) => {
        event.preventDefault();

        const timestampUrl =
            (event.target as Element).getAttribute("data-timestamp-url") || "";

        if (settingStore.timestampOption === "none") {
            viewStore.setAskVideoModalOpen(true);

            // Wait for user decision and opens the video accordingly
            await new Promise<void>((resolve) => {
                const unsubscribe = useSettingStore.subscribe((state) => {
                    if (state.timestampOption !== "none") {
                        if (state.timestampOption === "modal") {
                            viewStore.setVideoModalOpen(true);
                            viewStore.setVideoUrl(timestampUrl);
                        } else if (state.timestampOption === "tab") {
                            window.open(timestampUrl, "_blank");
                        }
                        unsubscribe();
                        resolve();
                    }
                });
            });

            viewStore.setAskVideoModalOpen(false);
        }

        if (settingStore.timestampOption === "modal") {
            viewStore.setVideoModalOpen(true);
            viewStore.setVideoUrl(timestampUrl);
        } else if (settingStore.timestampOption === "tab") {
            window.open(timestampUrl, "_blank");
        }
    };

    return (
        <Markdown
            className={"pb-20"}
            rehypePlugins={[rehypeRaw, remarkGfm]}
            components={{
                // br styles not working for some reason, will use a div instead
                br: () => <div className="block my-6" />,
                p: ({ children }) => {
                    // Put team icons next to team names
                    const teamIcons: { [key: string]: string } = {
                        "Amber Coin":
                            "https://cdn.holoen.fans/hefw/media/ambercoin.webp",
                        "Scarlet Wand":
                            "https://cdn.holoen.fans/hefw/media/scarletwand.webp",
                        "Cerulean Cup":
                            "https://cdn.holoen.fans/hefw/media/ceruleancup.webp",
                        "Jade Sword":
                            "https://cdn.holoen.fans/hefw/media/jadesword.webp",
                    };

                    const processNode = (node: ReactNode): ReactNode => {
                        if (typeof node === "string") {
                            const parts = node.split(
                                /(Amber Coin|Scarlet Wand|Cerulean Cup|Jade Sword)/g,
                            );

                            return parts.reduce(
                                (acc: ReactNode[], part, index) => {
                                    if (!part) return acc;

                                    if (teamIcons[part]) {
                                        return [
                                            ...acc,
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1"
                                            >
                                                {part}
                                                <img
                                                    className="inline h-6 w-6"
                                                    src={teamIcons[part]}
                                                    alt={part}
                                                />
                                            </span>,
                                        ];
                                    }

                                    return [...acc, part];
                                },
                                [],
                            );
                        }

                        if (isValidElement(node)) {
                            const newChildren = Children.map(
                                (node as React.ReactElement).props.children,
                                processNode,
                            );
                            return cloneElement(
                                node,
                                (node as React.ReactElement).props,
                                newChildren,
                            );
                        }

                        return node;
                    };

                    const processedChildren = Children.map(
                        children,
                        processNode,
                    );

                    return <>{processedChildren}</>;
                },
                a(props) {
                    const { href, ...rest } = props;

                    // Empty href is an easy to retain the correct cursor.
                    if (href && href.startsWith("#node:")) {
                        const nodeId = href.replace("#node:", "");

                        // Make the link's color the same as the node's
                        // Not sure about this one, might remove.
                        const node = getNode(nodeId);
                        const style = node?.style;
                        let nodeColor = "#831843";
                        if (style && style.stroke) {
                            nodeColor = style.stroke;
                        }
                        return (
                            <a
                                className="font-semibold underline"
                                style={{ color: nodeColor }}
                                href=""
                                data-node-id={nodeId}
                                onClick={nodeLinkHandler}
                                {...rest}
                            />
                        );
                    } else if (href && href.startsWith("#edge:")) {
                        const edgeId = href.replace("#edge:", "");

                        // Make the link's color the same as the edge's
                        // Not sure about this one either, might remove.
                        const edge = getEdge(edgeId);
                        const style = edge?.style;
                        let edgeColor = "#831843";
                        if (style && style.stroke) {
                            edgeColor = style.stroke;
                        }
                        return (
                            <a
                                className="font-semibold underline"
                                style={{ color: edgeColor }}
                                href=""
                                data-edge-id={edgeId}
                                onClick={edgeLinkHandler}
                                {...rest}
                            />
                        );
                    } else if (href && href.startsWith("#embed")) {
                        let url = href.replace("#embed:", "");
                        if (url.includes("embed")) {
                            // turn embed to live
                            // example https://www.youtube.com/embed/1_dhGL0K5-k?si=OCYF7bUx3zTLXPnC&amp;start=7439)
                            // to https://www.youtube.com/embed/1_dhGL0K5-k?t=7439
                            // This is mostly to handle mistakes I made at the beginning in the markdown
                            const videoid = url
                                .split("/embed/")[1]
                                .split("?si=")[0];
                            const params = url.split("start=")[1];
                            url = `https://www.youtube.com/live/${videoid}?t=${params}`;
                        }

                        const caption = rest.children as string;

                        return (
                            <a
                                href={url}
                                data-timestamp-url={href}
                                onClick={timestampHandler}
                                {...rest}
                                className="block text-center italic underline underline-offset-4 text-bold text-[1.125rem]"
                            >
                                {caption}
                            </a>
                        );
                    } else if (href && href.startsWith("#out")) {
                        const url = href.replace("#out:", "");
                        return (
                            <a
                                href={url}
                                target="_blank"
                                {...rest}
                                className="font-semibold"
                            />
                        );
                    } else if (href && href.startsWith("#image")) {
                        const imageUrl = href.replace("#image:", "");
                        const caption = rest.children as string;
                        return (
                            <figure>
                                <img
                                    src={imageUrl}
                                    alt={rest.children as string}
                                />
                                <figcaption className="text-sm opacity-80 italic mt-2">
                                    {caption}
                                </figcaption>
                            </figure>
                        );
                    } else {
                        return (
                            <a
                                className="font-semibold"
                                href={href}
                                data-timestamp-url={href}
                                onClick={timestampHandler}
                                {...rest}
                            />
                        );
                    }
                },
            }}
        >
            {children}
        </Markdown>
    );
}
