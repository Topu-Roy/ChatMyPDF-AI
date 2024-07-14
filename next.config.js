await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            { hostname: "utfs.io" },
            { hostname: "lh3.googleusercontent.com"}
        ],
    },
};

export default config;
