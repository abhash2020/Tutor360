
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutor360 | Home Tuition",
  description:
    "Best Experienced Teacher within 24 Hours at your Door Steps. An Initiative by Knowledge360.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
