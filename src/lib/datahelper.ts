"use client";

import JSZip from "jszip";
import { EditorChapter, EditorSaveMetadata } from "./type";

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

    const metadata: EditorSaveMetadata = {
        version: SAVE_VERSION,
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