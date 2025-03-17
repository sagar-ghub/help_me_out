// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   env: {
//     customKey: process.env.keyName, // pulls from .env file
//   },
//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       config.externals = config.externals || [];
//       config.externals.push("leaflet"); // Exclude Leaflet from SSR
//     }
//     return config;
//   },
// };

// module.exports = nextConfig;

// next.config.js
// next.config.js
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        // Explicitly exclude Leaflet from SSR
        { leaflet: "commonjs leaflet" },
        { "react-leaflet": "commonjs react-leaflet" },
      ];
    }
    return config;
  },
  experimental: {
    esmExternals: "loose", // Handle ESM packages properly
  },
};

module.exports = nextConfig;
