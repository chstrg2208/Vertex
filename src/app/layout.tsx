import type { Metadata } from "next";
import { Public_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vertex - Hệ thống cung cấp nhân sự CNTT theo dự án",
  description: "Giải pháp nhân sự IT staff augmentation, dedicated engineering teams và quản lý bảng lương chuyên nghiệp cho doanh nghiệp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${publicSans.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
