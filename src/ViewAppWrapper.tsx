import { Chapter, SiteData } from "./lib/type";
import ViewApp from "./ViewApp";

import siteMeta from "@/data/test/metadata.json";
import chapter1 from "@/data/test/chapter0.json";
import chapter2 from "@/data/test/chapter1.json";

const data: SiteData = {
    version: 1,
    numberOfChapters: siteMeta.numChapters,
    event: "Test Data V2",
    chapters: [
        chapter1 as Chapter,
        chapter2 as Chapter
    ]
}

export function ViewAppWrapper() {
    return (
        <ViewApp siteData={data} />
    )
}