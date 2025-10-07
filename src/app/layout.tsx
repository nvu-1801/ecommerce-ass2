import "./globals.css";
import Navbar from "@/components/Navbar";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
