"use client";

import JSZip from "jszip";
import { EditorChapter } from "./type";

export async function saveData(editorChapters: EditorChapter[]) {
    const utf8Encoder = new TextEncoder();
    const zipFile = new JSZip();
    let chNum = 0;

    for(const editorChapter of editorChapters) {
        const chJson = JSON.stringify(editorChapter, null, 2);
        zipFile.file(`chapter${chNum}.json`, utf8Encoder.encode(chJson));
        chNum++;
    }

    const metadata = {
        numChapters: chNum
    };
    const metadataJson = JSON.stringify(metadata, null, 2);
    zipFile.file("metadata.json", utf8Encoder.encode(metadataJson));

    const zipBlob = await zipFile.generateAsync({ type: "blob" });
    const zipBlobUrl = URL.createObjectURL(zipBlob);

    const dlLink = document.createElement("a");
    dlLink.setAttribute("href", zipBlobUrl);
    dlLink.setAttribute("download", `enreco-archive-editor-save-${new Date().toISOString()}.zip`);
    dlLink.style.display = "none";

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);

    URL.revokeObjectURL(zipBlobUrl);
}