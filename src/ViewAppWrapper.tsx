import { Chapter, SiteData } from "./lib/type";
import ViewApp from "./ViewApp";

import siteMeta from "@/data/metadata.json";
import chapter1 from "@/data/chapter0.json";

const data: SiteData = {
    version: 1,
    numberOfChapters: siteMeta.numChapters,
    event: "Test Data V2",
    chapters: [chapter1 as Chapter],
};

export function ViewAppWrapper() {
    return <ViewApp siteData={data} />;
}
