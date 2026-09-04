"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Upload, Compass, LogIn, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Hide navbar on login page to keep the login card focused
    if (pathname === "/login") return null;

    const navItems = [
        { label: "Browse", href: "/", icon: Compass },
        { label: "Upload", href: "/upload", icon: Upload },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand / Logo */}
                <Link href="/" className="group flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">
                        <BookOpen className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            Study<span className="text-indigo-600">Wise</span>
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Knowledge Hub
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-2 md:flex">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
                                )}
                            >
                                <Icon className="h-4 w-4 text-indigo-500" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        href="/upload"
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0"
                    >
                        <Upload className="h-4 w-4" />
                        <span>Upload Note</span>
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-indigo-600"
                    >
                        <LogIn className="h-4 w-4 text-indigo-500" />
                        <span>Sign In</span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation menu"
                        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                        {mobileOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur-md md:hidden">
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
                                    )}
                                >
                                    <Icon className="h-4 w-4 text-indigo-500" />
                                    {item.label}
                                </Link>
                            );
                        })}
                        <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
                            <Link
                                href="/upload"
                                onClick={() => setMobileOpen(false)}
                                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                            >
                                <Upload className="h-4 w-4" />
                                <span>Upload Note</span>
                            </Link>
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                <LogIn className="h-4 w-4 text-indigo-500" />
                                <span>Sign In</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
