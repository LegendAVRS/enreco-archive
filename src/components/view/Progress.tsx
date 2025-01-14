import { useViewStore } from "@/store/viewStore";
import React from "react";

const Progress = () => {
    const viewStore = useViewStore();
    const currentChapter = viewStore.siteData.chapters[viewStore.chapter];
    const currentDay = viewStore.day;
    const currentNumberOfDaysOffseted =
        currentChapter.numberOfDays > 1 ? currentChapter.numberOfDays - 1 : 1;
    return (
        <div className="fixed bottom-10 w-[500px] left-1/2 -translate-x-1/2">
            <div className="relative w-full transition-all bg-white opacity-50 cursor-pointer rounded-lg hover:opacity-100 h-[4px]">
                <div
                    className="absolute left-0 transition-all h-full rounded-lg bg-green-300"
                    style={{
                        width: `${
                            (currentDay / currentNumberOfDaysOffseted) * 100
                        }%`,
                    }}
                ></div>
                {Array.from({ length: currentChapter.numberOfDays }).map(
                    (_, index) => (
                        <div
                            key={index}
                            className="w-[20px] h-[20px] bg-black rounded-full absolute -translate-y-[8px] border-white border-2"
                            style={{
                                left: `${
                                    index * (100 / currentNumberOfDaysOffseted)
                                }%`,
                            }}
                            onClick={() => viewStore.setDay(index)}
                        ></div>
                    )
                )}
            </div>
        </div>
    );
};

export default Progress;
