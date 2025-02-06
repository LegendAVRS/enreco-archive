"use client";

import { 
    Chapter, 
    ChartData, 
    CustomEdgeType, 
    EditorChapter, 
    EditorImageNodeType, 
    EditorSaveMetadata, 
    FixedEdgeType, 
    ImageNodeType, 
    Metadata 
} from "@/lib/type";
import { generateOrthogonalEdgePath } from "@/lib/custom-edge-svg-path";

import { getSmoothStepPath, ReactFlowState } from "@xyflow/react";
import { getEdgePosition } from "@xyflow/system";
import JSZip from "jszip";

const SAVE_VERSION = 1;

function getChapterFileName(chapterIndex: number) {
    return `chapter${chapterIndex}.json`;
}

export async function saveData(editorChapters: EditorChapter[]) {
    const utf8Encoder = new TextEncoder();
    const zipFile = new JSZip();
    let chNum = 0;

    for(const editorChapter of editorChapters) {
        const chJson = JSON.stringify(editorChapter, null, 2);
        zipFile.file(getChapterFileName(chNum), utf8Encoder.encode(chJson));
        chNum++;
    }

    const saveDate = new Date().toISOString();
    const metadata: EditorSaveMetadata = {
        version: SAVE_VERSION,
        numChapters: chNum,
        saveDatetime: saveDate
    };

    const metadataJson = JSON.stringify(metadata, null, 2);
    zipFile.file("metadata.json", utf8Encoder.encode(metadataJson));

    const zipBlob = await zipFile.generateAsync({ type: "blob" });
    const zipBlobUrl = URL.createObjectURL(zipBlob);

    const dlLink = document.createElement("a");
    dlLink.setAttribute("href", zipBlobUrl);
    dlLink.setAttribute("download", `enreco-archive-editor-save-${saveDate}.zip`);
    dlLink.style.display = "none";

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);

    URL.revokeObjectURL(zipBlobUrl);
}

export async function loadData(setData: (newData: EditorChapter[]) => void) {
    const utf8Decoder = new TextDecoder("utf-8");
    
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "application/zip");

    fileInput.addEventListener("change", async (event) => {
        const target = event.target as HTMLInputElement;
        
        if(!target.files) {
            return;
        }

        const file = target.files[0];

        if(file.type !== "application/zip") {
            return;
        }
        
        const zipData = await file.arrayBuffer();
        const zipFile = await JSZip.loadAsync(zipData);
        
        const metadataFile = zipFile.filter((_, file) => file.name === "metadata.json")[0];
        const metadataData = await metadataFile.async("uint8array");
        const metadata: EditorSaveMetadata = JSON.parse(utf8Decoder.decode(metadataData));

        if(metadata.version !== SAVE_VERSION) {
            return;
        }

        const data = [];
        for(let i = 0; i < metadata.numChapters; i++) {
            const chFileName = getChapterFileName(i);
            const chFile = zipFile.filter((_, file) => file.name === chFileName)[0];
            const chData = await chFile.async("uint8array");
            const ch: EditorChapter = JSON.parse(utf8Decoder.decode(chData));
            data.push(ch);
        }

        setData(data);
    });

    fileInput.click();
}

export async function exportData(editorChapters: EditorChapter[], rfStore: ReactFlowState<EditorImageNodeType, CustomEdgeType>) {
    const exportData = editorChapters.map<Chapter>(editorChapter => {
        const chartData = editorChapter.charts.map<ChartData>(chart => {
            const nodes = chart.nodes.map(node => {
                const resultNode: ImageNodeType = {
                    ...node,
                    type: "image",
                    data: {
                        title: node.data.title,
                        content: node.data.content,
                        imageSrc: node.data.imageSrc,
                        teamId: node.data.teamId,
                        status: node.data.status,
                        new: node.data.new,
                        bgCardColor: node.data.bgCardColor
                    }
                };

                return resultNode;
            });

            const edges = chart.edges.map(edge => {
                // This code calculates the edge positions so we can pass it to the path generation functions.
                // It is copied from React Flow internals and also uses the React Flow internal store.
                // This code makes me very sad but is the least terrible way I can think of to do this.
                const sourceNode = rfStore.nodeLookup.get(edge.source);
                const targetNode = rfStore.nodeLookup.get(edge.target);

                if(!sourceNode || !targetNode) {
                    throw new Error("Invalid edge, missing either source or target!");
                }

                const onError = (id: string, message: string) => { throw new Error(`Failed to get position of edge ${id}: ${message}`); };

                const edgePosData = getEdgePosition({
                    id: edge.id,
                    sourceNode: sourceNode,
                    targetNode: targetNode,
                    sourceHandle: edge.sourceHandle || null,
                    targetHandle: edge.targetHandle || null,
                    connectionMode: rfStore.connectionMode,
                    onError: onError
                });

                if(edgePosData === null) {
                    throw new Error("Failed to get edge positioning data");
                }

                const {
                    sourceX,
                    sourceY,
                    targetX,
                    targetY,
                    sourcePosition,
                    targetPosition,
                } = edgePosData;

                let path = "";
                if(edge.type === "custom") {
                    path = generateOrthogonalEdgePath(
                        sourceX,
                        sourceY,
                        targetX,
                        targetY,
                        0,
                        edge.data!.customEdgeHCOffset,
                        edge.data!.customEdgeVROffset,
                        edge.data!.customEdgeVLOffset,
                        edge.data!.customEdgeHLOffset,
                        edge.data!.customEdgeHROffset
                    );
                }
                else if(edge.type === "customSmooth") {
                    [path] = getSmoothStepPath({
                        sourceX,
                        sourceY,
                        sourcePosition,
                        targetX,
                        targetY,
                        targetPosition,
                        borderRadius: 0,
                    });
                }
                else if(edge.type === "customStraight") {
                    [path] = getSmoothStepPath({
                        sourceX,
                        sourceY,
                        sourcePosition,
                        targetX,
                        targetY,
                        targetPosition,
                        borderRadius: 0,
                    });
                }
                else {
                    throw new Error(`Don't know how to generate path for edge ${edge.id} with type ${edge.type}.`);
                }

                const resultEdge: FixedEdgeType = {
                    ...edge,
                    type: "fixed",
                    data: {
                        relationshipId: edge.data!.relationshipId,
                        title: edge.data!.title,
                        content: edge.data!.content,
                        timestampUrl: edge.data!.timestampUrl,
                        path: path,
                        marker: edge.data!.marker,
                        new: edge.data!.new,
                    }
                };
                
                return resultEdge;
            });

            const resultChart: ChartData = {
                dayRecap: chart.dayRecap,
                title: chart.title,
                nodes: nodes,
                edges: edges
            };
            return resultChart;
        });
        
        const resultChapter: Chapter =  {
            numberOfDays: editorChapter.numberOfDays,
            title: editorChapter.title,
            charts: chartData,
            teams: editorChapter.teams,
            relationships: editorChapter.relationships,
        };

        return resultChapter;
    });

    const utf8Encoder = new TextEncoder();
    const zipFile = new JSZip();
    let chNum = 0;

    for(const chapter of exportData) {
        const chJson = JSON.stringify(chapter, null, 2);
        zipFile.file(getChapterFileName(chNum), utf8Encoder.encode(chJson));
        chNum++;
    }

    const exportDate = new Date().toISOString();
    const metadata: Metadata = {
        version: SAVE_VERSION,
        numChapters: chNum,
        exportDatetime: exportDate
    };

    const metadataJson = JSON.stringify(metadata, null, 2);
    zipFile.file("metadata.json", utf8Encoder.encode(metadataJson));

    const zipBlob = await zipFile.generateAsync({ type: "blob" });
    const zipBlobUrl = URL.createObjectURL(zipBlob);

    const dlLink = document.createElement("a");
    dlLink.setAttribute("href", zipBlobUrl);
    dlLink.setAttribute("download", `enreco-archive-export-${exportDate}.zip`);
    dlLink.style.display = "none";

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);

    URL.revokeObjectURL(zipBlobUrl);
}