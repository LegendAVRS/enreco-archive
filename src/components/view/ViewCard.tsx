import { cn } from "@/lib/utils";
import { useViewStore } from "@/store/viewStore";
import React from "react";

const ViewCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    // State to track if the screen is below the 'md' breakpoint
    const viewStore = useViewStore();

    return (
        <>
            {viewStore.currentCard !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-0 w-screen h-screen md:hidden" />
            )}
            <div
                ref={ref}
                className={cn(
                    "md:right-10 md:translate-x-0 right-1/2 translate-x-1/2 rounded-xl border-2 bg-card text-card-foreground flex flex-col shadow-2xl h-[90%] w-[90%] bg-white items-center gap-4  px-4 py-4 top-1/2 -translate-y-1/2 md:w-[500px] z-50",
                    className
                )}
                {...props}
            />
        </>
    );
});
ViewCard.displayName = "ViewCard";
export default ViewCard;
