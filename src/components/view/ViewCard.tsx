import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

const ViewCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    // State to track if the screen is below the 'md' breakpoint
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        // Function to check screen size
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768); // 'md' in Tailwind is 768px
        };

        // Initial check and event listener for resizing
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        // Cleanup listener on component unmount
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
        <>
            {isSmallScreen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-10 w-screen h-screen" />
            )}
            <div
                ref={ref}
                className={cn(
                    "md:right-10 md:translate-x-0 right-1/2 translate-x-1/2 rounded-xl border-2 bg-card text-card-foreground flex flex-col shadow-2xl h-[90%] bg-white items-center gap-4  px-4 py-4 top-1/2 -translate-y-1/2 w-[500px] max-h-[700px] z-50",
                    className
                )}
                {...props}
            />
        </>
    );
});
ViewCard.displayName = "ViewCard";
export default ViewCard;
