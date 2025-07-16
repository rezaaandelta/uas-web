/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org'], // untuk mengizinkan gambar TMDB
  },
};

module.exports = nextConfig;
