"use client";

import useSwr from "swr";
import Navbar from "../components/Navbar";
import { redirect } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data, error, isLoading } = useSwr("/user");

  if (isLoading) return <></>;

  if (error || !data) return redirect("/auth");

  return (
    <div className="h-full flex flex-col">
      <div className="grow overflow-y-auto">{children}</div>
      <Navbar />
    </div>
  );
}
