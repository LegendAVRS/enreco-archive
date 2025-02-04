/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // loader: "imgix",
        // formats: ["image/avif", "image/webp"],
        // path: "https://cdn.holoen.fans/hefw/media/",
        // remotePatterns: [
        //     {
        //         protocol: "https",
        //         hostname: "cdn.holoen.fans",
        //         port: "",
        //         pathname: "/hefw/media",
        //     },
        // ],
        unoptimized: true, // Disables image optimization.
    },
    reactStrictMode: false, // Disables React strict mode.
    output: "export", // Outputs a Single-Page Application (SPA).
};

export default nextConfig;
