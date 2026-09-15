import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "StudyWise",
    description: "AI-powered document categorization",
};

import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-slate-50/50 text-slate-900">
                <AuthProvider>
                    <Navbar />
                    <div className="flex-1">{children}</div>
                </AuthProvider>
                <Analytics />
            </body>
        </html>
    );
}
