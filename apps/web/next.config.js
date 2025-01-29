/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: `${process.env.IMG_URL_API_PROTOCOL}`,
                hostname: `${process.env.IMG_URL_API_HOST}`,
                port: `${process.env.IMG_URL_API_PORT}`,
                pathname: `${process.env.IMG_URL_API_PATH}`,
            },
        ],
    },
}

module.exports = nextConfig
