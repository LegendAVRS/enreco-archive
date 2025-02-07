import { FixedEdgeType, ImageNodeType } from "@/lib/type";
import { urlToEmbedUrl } from "@/lib/utils";
import { useSettingStore } from "@/store/settingStore";
import { useViewStore } from "@/store/viewStore";
import { YouTubeEmbed } from "@next/third-parties/google";
import { useReactFlow } from "@xyflow/react";
import { MouseEventHandler } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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
        event: React.MouseEvent<HTMLAnchorElement>,
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
        event: React.MouseEvent<HTMLAnchorElement>,
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
        event: React.MouseEvent<HTMLAnchorElement>,
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
            rehypePlugins={[rehypeRaw]}
            components={{
                p: ({ children }) => <>{children}</>,
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
                        const embedUrl = href.replace("#embed:", "");
                        const { videoid, params } = urlToEmbedUrl(embedUrl);
                        const caption = rest.children as string;

                        return (
                            <figure>
                                <YouTubeEmbed
                                    videoid={videoid}
                                    params={params}
                                />
                                <figcaption>{caption}</figcaption>
                            </figure>
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
                                <figcaption>{caption}</figcaption>
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
