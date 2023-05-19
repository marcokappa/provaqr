const isProd = process.env.NODE_ENV === "production";


/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: isProd ? "/provaqr" : "",
}

module.exports = nextConfig
