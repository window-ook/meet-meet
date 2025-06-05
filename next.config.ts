// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "sprint-fe-project.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: 'https',
        hostname: 'media.timeout.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.banronbodo.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mirae-biz.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      }
    ],
  },
  webpack(config, { isServer: _isServer }) {
    // SVGR 로더 추가: .svg 파일을 React 컴포넌트로 사용할 수 있게 처리
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
