"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    FileText,
    Upload,
    Search,
    Eye,
    ThumbsUp,
    Sparkles,
    ArrowRight,
    BookOpen,
    Filter,
    GraduationCap,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const heroRef = useRef(null);
    const gridRef = useRef(null);

    // --- BACKEND LOGIC (UNTOUCHED API CALL) ---
    useEffect(() => {
        fetch(`${API_URL}/api/resources`)
            .then((res) => res.json())
            .then((data) => setResources(data.resources || []))
            .catch((err) => console.error("Failed to fetch resources:", err))
            .finally(() => setLoading(false));
    }, []);

    // Extract unique subjects for filtering
    const subjects = useMemo(() => {
        const set = new Set();
        resources.forEach((r) => {
            if (r.subject?.name) set.add(r.subject.name);
        });
        return Array.from(set);
    }, [resources]);

    // Client-side filtering & sorting
    const filteredResources = useMemo(() => {
        return resources
            .filter((r) => {
                const matchSearch =
                    r.title
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    r.description
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    r.subject?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    r.user?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase());
                const matchSubject =
                    selectedSubject === "all" ||
                    r.subject?.name === selectedSubject;
                return matchSearch && matchSubject;
            })
            .sort((a, b) => {
                if (sortBy === "votes") {
                    return (b.votes?.length || 0) - (a.votes?.length || 0);
                }
                if (sortBy === "views") {
                    return (b.views || 0) - (a.views || 0);
                }
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            });
    }, [resources, searchQuery, selectedSubject, sortBy]);

    // GSAP Animation for Hero
    useGSAP(
        () => {
            if (!heroRef.current) return;
            const items = heroRef.current.querySelectorAll("[data-hero-item]");
            gsap.fromTo(
                items,
                { autoAlpha: 0, y: 24 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.09,
                    ease: "power3.out",
                },
            );
        },
        { scope: heroRef },
    );

    // GSAP Animation for Resource Cards
    useGSAP(
        () => {
            if (!gridRef.current || loading) return;
            const cards = gridRef.current.querySelectorAll(
                "[data-resource-card]",
            );
            if (cards.length > 0) {
                gsap.fromTo(
                    cards,
                    { autoAlpha: 0, y: 28, scale: 0.98 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        stagger: 0.05,
                        ease: "power3.out",
                        clearProps: "transform",
                    },
                );
            }
        },
        {
            scope: gridRef,
            dependencies: [
                loading,
                filteredResources.length,
                selectedSubject,
                sortBy,
            ],
        },
    );

    return (
        <main className="min-h-screen pb-20">
            {/* HERO SECTION - Inspired by Login Screen Aesthetic */}
            <section
                ref={heroRef}
                className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#8e9aff_0,_#6874df_34%,_#5b4eaa_100%)] px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8"
            >
                {/* Glowing Blur Orbs */}
                <div className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#a78bfa]/30 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-300/10 blur-2xl" />

                {/* Decorative Rings */}
                <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full border-[48px] border-white/[0.08]" />
                <div className="pointer-events-none absolute -bottom-40 -left-28 h-[28rem] w-[28rem] rounded-full border-[54px] border-white/[0.06]" />

                <div className="relative mx-auto max-w-5xl text-center">
                    <div
                        data-hero-item
                        className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-white shadow-inner backdrop-blur-md"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                        <span>Smart Peer Learning Hub</span>
                    </div>

                    <h1
                        data-hero-item
                        className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        Master your coursework,{" "}
                        <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
                            one resource at a time.
                        </span>
                    </h1>

                    <p
                        data-hero-item
                        className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-indigo-50/90 sm:text-lg"
                    >
                        Discover curated lecture slides, comprehensive notes,
                        past exam papers, and guides shared by top students in
                        your academic community.
                    </p>

                    <div
                        data-hero-item
                        className="mt-10 flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link
                            href="/upload"
                            className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-indigo-700 shadow-xl shadow-indigo-950/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-2xl active:translate-y-0"
                        >
                            <Upload className="h-4 w-4 text-indigo-600" />
                            <span>Upload a Resource</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a
                            href="#browse"
                            className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-white/40 bg-white/5 px-7 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/15"
                        >
                            <BookOpen className="h-4 w-4" />
                            <span>Explore Library</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* BROWSE & FILTER CONTROLS */}
            <div
                id="browse"
                className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-indigo-600">
                            Knowledge Repository
                        </p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Explore Shared Resources
                        </h2>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by title, subject, user..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                {/* Filter Pills & Sorting */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-6">
                    {/* Subject Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setSelectedSubject("all")}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                                selectedSubject === "all"
                                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            All Subjects ({resources.length})
                        </button>
                        {subjects.map((sub) => (
                            <button
                                key={sub}
                                type="button"
                                onClick={() => setSelectedSubject(sub)}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                                    selectedSubject === sub
                                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="newest">Most Recent</option>
                            <option value="views">Most Viewed</option>
                            <option value="votes">Most Upvoted</option>
                        </select>
                    </div>
                </div>

                {/* RESOURCE CARDS GRID */}
                <div ref={gridRef} className="mt-8">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <div className="h-44 w-full rounded-xl bg-slate-100" />
                                    <div className="mt-4 h-4 w-1/3 rounded bg-slate-100" />
                                    <div className="mt-2 h-5 w-4/5 rounded bg-slate-200" />
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="h-3 w-1/4 rounded bg-slate-100" />
                                        <div className="h-3 w-1/5 rounded bg-slate-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredResources.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-12 text-center backdrop-blur-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <BookOpen className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">
                                No resources found
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                {searchQuery || selectedSubject !== "all"
                                    ? "Try adjusting your search query or subject filters."
                                    : "Be the first to share notes and study material with your peers."}
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/upload"
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-lg"
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload Resource
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredResources.map((r) => (
                                <Link
                                    key={r.id}
                                    href={`/resources/${r.id}`}
                                    data-resource-card
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl"
                                >
                                    {/* Thumbnail Preview Area */}
                                    <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50">
                                        {r.thumbnailUrl ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={r.thumbnailUrl}
                                                alt={r.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm text-indigo-600 transition-transform group-hover:scale-110">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Document Preview
                                                </span>
                                            </div>
                                        )}

                                        {/* Subject Pill Badge */}
                                        {r.subject?.name && (
                                            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur-md">
                                                <GraduationCap className="h-3.5 w-3.5" />
                                                {r.subject.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="line-clamp-2 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                                            {r.title}
                                        </h3>

                                        {r.description && (
                                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                                                {r.description}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-4">
                                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                                                {/* Author */}
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

                                                {/* Views & Votes */}
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
