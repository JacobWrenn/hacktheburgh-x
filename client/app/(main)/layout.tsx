import Navbar from "../components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full flex flex-col">
      <div className="grow overflow-y-auto">{children}</div>
      <Navbar />
    </div>
  );
}
