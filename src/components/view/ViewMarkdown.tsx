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
                        return (
                            <a
                                href=""
                                data-node-id={nodeId}
                                onClick={nodeLinkHandler}
                                {...rest}
                            />
                        );
                    } else if (href && href.startsWith("#edge:")) {
                        const edgeId = href.replace("#edge:", "");
                        return (
                            <a
                                href=""
                                data-edge-id={edgeId}
                                onClick={edgeLinkHandler}
                                {...rest}
                            />
                        );
                    } else if (href && href.startsWith("#embed")) {
                        const url = href.replace("#embed:", "");
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
                        return <a href={href} target="_blank" {...rest} />;
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
