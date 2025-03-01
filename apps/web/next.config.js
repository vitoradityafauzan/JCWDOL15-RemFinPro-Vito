/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: `${process.env.NEXT_PUBLIC_IMG_URL_API_PROTOCOL}`,
                hostname: `${process.env.NEXT_PUBLIC_IMG_URL_API_HOST}`,
                port: `${process.env.NEXT_PUBLIC_IMG_URL_API_PORT}`,
                pathname: `${process.env.NEXT_PUBLIC_IMG_URL_API_PATH}`,
            },
        ],
    },
}

module.exports = nextConfig
