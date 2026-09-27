import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Lusora", description: "Experiencias simbólicas impulsadas por IA" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
