import { useEffect, useState } from "react";

export function useBrowserHash(onBrowserHashChange: (hashValue: string) => void) {
    const [browserHash, setBrowserHash] = useState("");

    useEffect(() => {
        const hashChangeListener = () => {
            const hash = window.location.hash.substring(1);
            setBrowserHash(hash);
            onBrowserHashChange(hash);
        };

        window.addEventListener("hashchange", hashChangeListener);
        return () => {
            window.removeEventListener("hashchange", hashChangeListener);
        };
    }, [onBrowserHashChange]);

    useEffect(() => {
        window.history.replaceState({}, "", `#${browserHash}`);
    }, [browserHash])

    return { browserHash, setBrowserHash };
}