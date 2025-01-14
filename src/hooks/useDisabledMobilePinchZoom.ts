import { useEffect } from "react";

export function useDisabledMobilePinchZoom() {
    useEffect(() => {
        document.addEventListener(
            "gesturestart",
            (e) => {
                e.preventDefault();
            },
            { passive: false }
        );

        document.addEventListener(
            "gesturechange",
            (e) => {
                e.preventDefault();
            },
            { passive: false }
        );

        document.addEventListener(
            "gestureend",
            (e) => {
                e.preventDefault();
            },
            { passive: false }
        );
    }, []);
}