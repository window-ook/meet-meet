import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import Providers from "@/providers/Providers";
import Navbar from '@/components/shared/ui/Navbar';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: "Meet Meet",
  description: "서울 2030을 위한 모임",
  keywords: [
    '밋밋',
    '밋밋 모임 앱',
    '밋밋 모임',
    'Meet Meet',
    'meet meet',
    'MeetMeet',
    'meetmeet',
  ],
  openGraph: {
    url: 'https://meet-meet-psi.vercel.app',
    type: 'website',
    locale: 'ko_KR',
    title: 'Meet Meet',
    siteName: 'Meet Meet',
    description: '서울 2030을 위한 모임',
    images: [
      {
        url: 'https://meet-meet-psi.vercel.app/images/og_image.png',
        width: 1200,
        height: 630,
        alt: 'Meet Meet OG 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meet Meet',
    description: '서울 2030을 위한 모임',
    images: ['https://meet-meet-psi.vercel.app/images/og_image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pretendard.variable} font-pretendard text-global-text`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
