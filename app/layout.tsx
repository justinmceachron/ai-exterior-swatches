import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Initialize the font
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Regular, Medium, Semi-Bold, Bold
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Exterior Visual Configurator",
  description: "Visualize premium roofing and siding on your home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}