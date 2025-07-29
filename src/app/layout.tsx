import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "おいしいを攻略せよ！渋谷うまいものマップ｜太田胃散",
  description: "渋谷エリアのおすすめレストランを地図で探せるアプリ。辛い、油っぽい、甘いカテゴリで絞り込み検索が可能です。",
  keywords: ["レストラン", "グルメ", "渋谷", "地図", "太田さん", "辛い", "油っぽい", "甘い"],
  authors: [{ name: "太田さんマップ" }],
  creator: "太田さんマップ",
  publisher: "太田さんマップ",
  openGraph: {
    title: "おいしいを攻略せよ！渋谷うまいものマップ｜太田胃散",
    description: "渋谷エリアのおすすめレストランを地図で探せるアプリ",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "おいしいを攻略せよ！渋谷うまいものマップ｜太田胃散",
    description: "渋谷エリアのおすすめレストランを地図で探せるアプリ",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
