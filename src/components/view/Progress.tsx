import { Chapter } from "@/lib/type";
import React from "react";

interface Props {
    chapterData: Chapter,
    day: number,
    onDayChange: (newDay: number) => void
}

const Progress = ({ chapterData, day, onDayChange }: Props) => {
    const currentNumberOfDaysOffseted = chapterData.numberOfDays > 1 ? chapterData.numberOfDays - 1 : 1;
    return (
        <div className="fixed bottom-10 w-[500px] left-1/2 -translate-x-1/2">
            <div className="relative w-full transition-all bg-white opacity-50 cursor-pointer rounded-lg hover:opacity-100 h-[4px]">
                <div
                    className="absolute left-0 transition-all h-full rounded-lg bg-green-300"
                    style={{
                        width: `${
                            (day / currentNumberOfDaysOffseted) * 100
                        }%`,
                    }}
                ></div>
                {Array.from({ length: chapterData.numberOfDays }).map(
                    (_, index) => (
                        <div
                            key={index}
                            className="w-[20px] h-[20px] bg-black rounded-full absolute -translate-y-[8px] border-white border-2"
                            style={{
                                left: `${
                                    index * (100 / currentNumberOfDaysOffseted)
                                }%`,
                            }}
                            onClick={() => onDayChange(index)}
                        ></div>
                    )
                )}
            </div>
        </div>
    );
};

export default Progress;
