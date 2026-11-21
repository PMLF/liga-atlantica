import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liga Atlântica",
  description: "A fictional Portuguese football league, built to explore Storybook and Chromatic.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
