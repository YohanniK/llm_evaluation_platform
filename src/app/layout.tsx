import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "EVALENS",
  description: "Evaluate your LLMs",
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrainsMono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable}`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          </ConvexClientProvider>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
