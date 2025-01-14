import { findCenterViewOfEdge } from "@/lib/centerViewOnEdge";
import { CustomEdgeType, ImageNodeType } from "@/lib/type";
import { useFlowStore } from "@/store/flowStore";
import { useViewStore } from "@/store/viewStore";
import { useReactFlow } from "@xyflow/react";
import { MouseEventHandler } from "react";
import { isMobile } from "react-device-detect";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface Props {
    children: string | null | undefined
}

/*
Wraps react-markdown while transforming links with a special href value to jump to specific nodes/edges.
All other links are transformed to open in a new tab.

You can generate these special links by using the following markdown: 
For a link to jump to a specific node: [node link](#node:<node id>)
For a link to jump to a specific edge: [edge link](#edge:<edge id>)
*/
export function ViewMarkdown({ children }: Props) {
    const { setSelectedEdge, setSelectedNode } = useFlowStore();
    const { setCurrentCard } = useViewStore();
    const { getNode, getEdge, fitView, setCenter } = useReactFlow<ImageNodeType, CustomEdgeType>();

    const nodeLinkHandler: MouseEventHandler<HTMLAnchorElement> = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()

        const nodeId = (event.target as Element).getAttribute('data-node-id') || '';
        const targetNode: ImageNodeType | undefined = getNode(nodeId);
        if(!targetNode) {
            return;
        }

        setSelectedNode(targetNode);
        fitView({
            nodes: [targetNode],
            duration: 1000,
            maxZoom: 1.5,
        });
        setCurrentCard("node");
    }

    const edgeLinkHandler: MouseEventHandler<HTMLAnchorElement> = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()

        const edgeId = (event.target as Element).getAttribute('data-edge-id') || '';
        const targetEdge: CustomEdgeType | undefined = getEdge(edgeId);
        if(!targetEdge) {
            return;
        }

        setSelectedEdge(targetEdge);
        const nodeA = getNode(targetEdge.source);
        const nodeB = getNode(targetEdge.target);
        if(!nodeA || !nodeB) {
            return;
        }
        
        const {centerPointX, centerPointY, duration, zoom} = findCenterViewOfEdge(nodeA, nodeB, targetEdge, isMobile);

        // Pan to calculated center point
        setCenter(centerPointX, centerPointY, {
            duration: duration,
            zoom: zoom,
        });
        setCurrentCard("edge");
    }

    return (
    <Markdown rehypePlugins={[rehypeRaw]}
        components={{
            a(props) {
                const {href, ...rest} = props;

                // Empty href is an easy to retain the correct cursor.
                if(href && href.startsWith("#node:")) {
                    const nodeId = href.replace("#node:", "");
                    return <a href="" data-node-id={nodeId} onClick={nodeLinkHandler} {...rest} />
                }
                else if(href && href.startsWith("#edge:")) {
                    const edgeId = href.replace("#edge:", "");
                    return <a href="" data-edge-id={edgeId} onClick={edgeLinkHandler} {...rest} />
                }
            
                return <a href={href} target='_blank' {...rest} />
            }
        }}
    >
        {children}
    </Markdown>
    );
}