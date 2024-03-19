const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  basePath: process.env.BASE_PATH || "",
  publicRuntimeConfig: {
    basePath: process.env.BASE_PATH || "",
    apiUrl: process.env.API_URL || "",
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/app-api/:path*",
          destination: `${process.env.API_URL}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
