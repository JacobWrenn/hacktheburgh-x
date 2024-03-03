"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { SWRConfig } from "swr";

const inter = Inter({ subsets: ["latin"] });

async function fetchApi(endpoint: string, options?: RequestInit) {
  return fetch("/api"+endpoint, options).then((res) => res.json());
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SWRConfig value={{ fetcher: fetchApi }}>
      <html className="h-full" lang="en">
        <body className={inter.className + " h-full overflow-hidden"}>
          {children}
        </body>
      </html>
    </SWRConfig>
  );
}
