import { Chapter, SiteData } from "./lib/type";
import ViewApp from "./ViewApp";

import siteMeta from "@/data/site-meta.json";
import chapter1 from "@/data/chapter0.json";

const data: SiteData = {
    numberOfChapters: siteMeta.numberOfChapters,
    event: siteMeta.event,
    chapters: [
        chapter1 as Chapter
    ]
}

export function ViewAppWrapper() {
    return (
        <ViewApp siteData={data} />
    )
}