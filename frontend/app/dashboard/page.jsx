"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    BookOpen,
    Upload,
    Sparkles,
    FileText,
    ThumbsUp,
    Eye,
    ArrowRight,
    GraduationCap,
    Compass,
    PlusCircle,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    const [recentResources, setRecentResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/resources`)
            .then((res) => res.json())
            .then((data) =>
                setRecentResources((data.resources || []).slice(0, 6)),
            )
            .catch(() => setRecentResources([]))
            .finally(() => setLoading(false));
    }, []);

    // GSAP Hero Animation
    useGSAP(
        () => {
            if (!heroRef.current) return;
            const items = heroRef.current.querySelectorAll("[data-hero-item]");
            gsap.fromTo(
                items,
                { autoAlpha: 0, y: 22 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.65,
                    stagger: 0.08,
                    ease: "power3.out",
                },
            );
        },
        { scope: heroRef },
    );

    // GSAP Content Animation
    useGSAP(
        () => {
            if (!contentRef.current || loading) return;
            const cards =
                contentRef.current.querySelectorAll("[data-card-item]");
            if (cards.length > 0) {
                gsap.fromTo(
                    cards,
                    { autoAlpha: 0, y: 24, scale: 0.98 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        stagger: 0.06,
                        ease: "power3.out",
                        clearProps: "transform",
                    },
                );
            }
        },
        { scope: contentRef, dependencies: [loading, recentResources] },
    );

    return (
        <main className="min-h-screen pb-24 bg-slate-50/70">
            {/* HERO BANNER - Exact Login & Home Aesthetic */}
            <section
                ref={heroRef}
                className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#8e9aff_0,_#6874df_34%,_#5b4eaa_100%)] px-4 pb-20 pt-14 text-white sm:px-6 sm:pb-28 sm:pt-20 lg:px-8"
            >
                {/* Glowing Blur Orbs */}
                <div className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#a78bfa]/30 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-300/10 blur-2xl" />

                {/* Decorative Concentric Rings */}
                <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full border-[48px] border-white/[0.08]" />
                <div className="pointer-events-none absolute -bottom-40 -left-28 h-[28rem] w-[28rem] rounded-full border-[54px] border-white/[0.06]" />

                <div className="relative mx-auto max-w-5xl text-center">
                    <div
                        data-hero-item
                        className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-white shadow-inner backdrop-blur-md"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                        <span>Personal Study Workspace</span>
                    </div>

                    <h1
                        data-hero-item
                        className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        Welcome Back to{" "}
                        <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
                            StudyWise
                        </span>
                    </h1>

                    <p
                        data-hero-item
                        className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-indigo-50/90 sm:text-lg"
                    >
                        Pick up where you left off. Access your academic
                        community&apos;s latest materials, upload helpful
                        resources, and keep your momentum going.
                    </p>

                    <div
                        data-hero-item
                        className="mt-8 flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link
                            href="/upload"
                            className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-indigo-700 shadow-xl shadow-indigo-950/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-50 active:translate-y-0"
                        >
                            <Upload className="h-4 w-4 text-indigo-600" />
                            <span>Upload a Resource</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-white/40 bg-white/5 px-7 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/15"
                        >
                            <Compass className="h-4 w-4" />
                            <span>Explore Library</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT AREA */}
            <div
                ref={contentRef}
                className="mx-auto -mt-10 max-w-6xl px-4 sm:px-6 lg:px-8"
            >
                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Link
                        href="/upload"
                        data-card-item
                        className="group relative flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-indigo-950/5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-105">
                                <PlusCircle className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    Contribute Notes
                                </h3>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Upload PDF, DOCX, or PPT course guides
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-600" />
                    </Link>

                    <Link
                        href="/"
                        data-card-item
                        className="group relative flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-indigo-950/5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition-transform group-hover:scale-105">
                                <BookOpen className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                                    Browse Repository
                                </h3>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Filter and search community study materials
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-violet-600" />
                    </Link>
                </div>

                {/* Latest Uploads Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-indigo-600">
                                Recent Activity
                            </p>
                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                Latest Community Uploads
                            </h2>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 transition-colors hover:text-indigo-800"
                        >
                            <span>View all library</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <div className="h-40 w-full rounded-xl bg-slate-100" />
                                    <div className="mt-4 h-4 w-1/3 rounded bg-slate-100" />
                                    <div className="mt-2 h-5 w-4/5 rounded bg-slate-200" />
                                </div>
                            ))}
                        </div>
                    ) : recentResources.length === 0 ? (
                        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-white/70 p-12 text-center backdrop-blur-sm">
                            <BookOpen className="mx-auto h-12 w-12 text-indigo-400" />
                            <p className="mt-3 text-sm font-semibold text-slate-700">
                                No resources uploaded yet.
                            </p>
                            <Link
                                href="/upload"
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
                            >
                                <Upload className="h-3.5 w-3.5" />
                                <span>Upload first note</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {recentResources.map((r) => (
                                <Link
                                    key={r.id}
                                    href={`/resources/${r.id}`}
                                    data-card-item
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl"
                                >
                                    {/* Thumbnail Preview Area */}
                                    <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50">
                                        {r.thumbnailUrl ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={r.thumbnailUrl}
                                                alt={r.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-indigo-600 transition-transform group-hover:scale-110">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Subject Pill Badge */}
                                        {r.subject?.name && (
                                            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 shadow-sm backdrop-blur-md">
                                                <GraduationCap className="h-3 w-3" />
                                                {r.subject.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                                            {r.title}
                                        </h3>

                                        {r.description && (
                                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                                                {r.description}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-4">
                                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1.5 truncate font-medium text-slate-600">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                                                        {(r.user?.name ||
                                                            "U")[0].toUpperCase()}
                                                    </span>
                                                    <span className="truncate">
                                                        {r.user?.name ||
                                                            "Anonymous"}
                                                    </span>
                                                </span>

                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3.5 w-3.5" />
                                                        {r.views || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-semibold text-indigo-600">
                                                        <ThumbsUp className="h-3.5 w-3.5" />
                                                        {r.votes?.length || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
