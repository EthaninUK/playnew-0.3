import type { Metadata } from "next";
import "./globals.css";
import "./nprogress.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Header } from "@/components/shared/Header";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Footer } from "@/components/shared/Footer";
import { Web3Provider } from "@/lib/wagmi/providers";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Toaster } from "sonner";
import { TawkToWidget } from "@/components/TawkToWidget";

export const metadata: Metadata = {
  title: "PlayNew.ai - 探索 Web3 新玩法",
  description: "PlayNew.ai - 您的 Web3 导航助手，探索最新的加密货币玩法、DeFi 策略和空投机会",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Web3Provider>
          <ProgressBar />
          <Header />
          <Breadcrumbs />
          <main>{children}</main>
          <Footer />
          <Toaster position="top-center" richColors />
          <TawkToWidget />
        </Web3Provider>
      </body>
    </html>
  );
}
