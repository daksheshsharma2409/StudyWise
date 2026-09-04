"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    ArrowLeft,
    ExternalLink,
    Download,
    Share2,
    Eye,
    ThumbsUp,
    Check,
    GraduationCap,
    AlertCircle,
    FileText,
    Sparkles,
} from "lucide-react";
import { FileViewer } from "@/components/file-viewer";

gsap.registerPlugin(useGSAP);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResourceDetailPage() {
    const { id } = useParams();
    const heroRef = useRef(null);
    const viewerCardRef = useRef(null);

    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    // --- BACKEND LOGIC (UNTOUCHED) ---
    useEffect(() => {
        if (!id) return;
        fetch(`${API_URL}/api/resources/${id}`)
            .then((res) => {
                if (!res.ok)
                    throw new Error("Resource not found or failed to load.");
                return res.json();
            })
            .then((data) => setResource(data.resource))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    // GSAP Hero Animation
    useGSAP(
        () => {
            if (!heroRef.current || !resource) return;
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
        { scope: heroRef, dependencies: [resource] },
    );

    // GSAP Viewer Animation
    useGSAP(
        () => {
            if (!viewerCardRef.current || !resource) return;
            gsap.fromTo(
                viewerCardRef.current,
                { autoAlpha: 0, y: 28, scale: 0.99 },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: 0.1,
                    ease: "power3.out",
                    clearProps: "transform",
                },
            );
        },
        { scope: viewerCardRef, dependencies: [resource] },
    );

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/70">
                <div className="relative h-72 animate-pulse bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-600" />
                <div className="mx-auto -mt-20 max-w-5xl px-4 sm:px-6">
                    <div className="h-[600px] animate-pulse rounded-[2rem] bg-white p-6 shadow-xl" />
                </div>
            </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 shadow-inner">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                    Unable to load resource
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    {error ||
                        "The resource you are looking for might have been removed."}
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Library
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-24 bg-slate-50/70">
            {/* HERO BANNER - Exact Login & Home Aesthetic */}
            <section
                ref={heroRef}
                className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#8e9aff_0,_#6874df_34%,_#5b4eaa_100%)] px-4 pb-24 pt-12 text-white sm:px-6 sm:pb-32 sm:pt-16 lg:px-8"
            >
                {/* Glowing Blur Orbs */}
                <div className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#a78bfa]/30 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-300/10 blur-2xl" />

                {/* Decorative Concentric Rings */}
                <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full border-[48px] border-white/[0.08]" />
                <div className="pointer-events-none absolute -bottom-40 -left-28 h-[28rem] w-[28rem] rounded-full border-[54px] border-white/[0.06]" />

                <div className="relative mx-auto max-w-5xl">
                    {/* Breadcrumbs */}
                    <div
                        data-hero-item
                        className="flex items-center gap-2 text-xs font-semibold text-indigo-100"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Library
                        </Link>
                        <span>/</span>
                        <span className="text-white/80">
                            {resource.subject?.name || "General"}
                        </span>
                        <span>/</span>
                        <span className="truncate text-white max-w-[200px] sm:max-w-xs font-bold">
                            {resource.title}
                        </span>
                    </div>

                    {/* Title & Subject */}
                    <div data-hero-item className="mt-6">
                        {resource.subject?.name && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3.5 py-1 text-xs font-bold text-white shadow-inner backdrop-blur-md">
                                <GraduationCap className="h-3.5 w-3.5" />
                                {resource.subject.name}
                            </span>
                        )}

                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                            {resource.title}
                        </h1>

                        {resource.description && (
                            <p className="mt-3 max-w-3xl text-base leading-relaxed text-indigo-50/90 sm:text-lg">
                                {resource.description}
                            </p>
                        )}
                    </div>

                    {/* Meta Info & Action Toolbar */}
                    <div
                        data-hero-item
                        className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6"
                    >
                        {/* Meta items */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-indigo-100">
                            {/* Author */}
                            <div className="flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-indigo-700 shadow-xs">
                                    {(resource.user?.name ||
                                        "U")[0].toUpperCase()}
                                </span>
                                <span>
                                    {resource.user?.name ||
                                        "Anonymous uploader"}
                                </span>
                            </div>

                            <span className="text-white/30">•</span>

                            {/* Views */}
                            <span className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5 text-indigo-200" />
                                <strong>{resource.views || 0}</strong> views
                            </span>

                            <span className="text-white/30">•</span>

                            {/* Votes */}
                            <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3.5 w-3.5 text-indigo-200" />
                                <strong>{resource.votes?.length || 0}</strong>{" "}
                                upvotes
                            </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2.5">
                            <a
                                href={resource.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-xs font-bold text-indigo-700 shadow-lg shadow-indigo-950/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-50 active:translate-y-0"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Open Full Document</span>
                            </a>

                            <a
                                href={resource.fileUrl}
                                download
                                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-4 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
                                title="Download File"
                            >
                                <Download className="h-3.5 w-3.5" />
                                <span>Download</span>
                            </a>

                            <button
                                type="button"
                                onClick={handleShare}
                                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-4 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
                                title="Share resource"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                                        <span className="text-emerald-200">
                                            Copied!
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="h-3.5 w-3.5" />
                                        <span>Share</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* VIEWER CONTAINER - Overlapping Card */}
            <div className="mx-auto -mt-16 max-w-5xl px-4 sm:px-6">
                <div
                    ref={viewerCardRef}
                    className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white p-4 shadow-2xl shadow-indigo-950/10 sm:p-6"
                >
                    <FileViewer resource={resource} />
                </div>
            </div>
        </main>
    );
}
