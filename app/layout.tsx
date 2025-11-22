import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TBD",
  description: "ETH Global Buenos Aires Hackathon Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
