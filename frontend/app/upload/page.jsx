"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    UploadCloud,
    FileText,
    X,
    AlignLeft,
    BookOpen,
    Loader2,
    ArrowRight,
    Sparkles,
    AlertCircle,
    ArrowLeft,
    GraduationCap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UploadPage() {
    const router = useRouter();
    const heroRef = useRef(null);
    const formCardRef = useRef(null);
    const fileInputRef = useRef(null);

    const [subjects, setSubjects] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // --- BACKEND LOGIC (UNTOUCHED) ---
    useEffect(() => {
        fetch(`${API_URL}/api/subjects`)
            .then((res) => res.json())
            .then((data) => setSubjects(data.subjects || []))
            .catch(() => setError("Could not load subjects."));
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

    // GSAP Form Card Animation
    useGSAP(
        () => {
            if (!formCardRef.current) return;
            gsap.fromTo(
                formCardRef.current,
                { autoAlpha: 0, y: 30, scale: 0.98 },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: 0.15,
                    ease: "power3.out",
                    clearProps: "transform",
                },
            );
        },
        { scope: formCardRef },
    );

    function handleDragOver(e) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(e) {
        e.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) setFile(droppedFile);
    }

    function handleFileSelect(e) {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) setFile(selectedFile);
    }

    function formatFileSize(bytes) {
        if (!bytes) return "";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }

    // --- BACKEND LOGIC (UNTOUCHED) ---
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!file) return setError("Please select or drop a file.");
        if (!subjectId) return setError("Please choose a subject.");

        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("subjectId", subjectId);
        formData.append("file", file);

        try {
            const res = await fetch(`${API_URL}/api/resources/upload`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 401)
                    throw new Error("Please log in to upload.");
                throw new Error(data.error || "Upload failed.");
            }
            router.push(`/resources/${data.resource.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const fieldClass =
        "h-14 rounded-xl border border-slate-200 bg-slate-50 pl-12 text-[15px] text-slate-900 shadow-none placeholder:text-slate-400 transition-all focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-100";
    const iconClass =
        "pointer-events-none absolute left-4 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-indigo-400";

    return (
        <main className="min-h-screen pb-24 bg-slate-50/70">
            {/* HERO BANNER - Exact Login & Home Aesthetic */}
            <section
                ref={heroRef}
                className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#8e9aff_0,_#6874df_34%,_#5b4eaa_100%)] px-4 pb-24 pt-14 text-white sm:px-6 sm:pb-32 sm:pt-20 lg:px-8"
            >
                {/* Glowing Blur Orbs */}
                <div className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#a78bfa]/30 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-300/10 blur-2xl" />

                {/* Decorative Concentric Rings */}
                <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full border-[48px] border-white/[0.08]" />
                <div className="pointer-events-none absolute -bottom-40 -left-28 h-[28rem] w-[28rem] rounded-full border-[54px] border-white/[0.06]" />

                <div className="relative mx-auto max-w-4xl text-center">
                    <div
                        data-hero-item
                        className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-white shadow-inner backdrop-blur-md"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                        <span>Knowledge Contribution</span>
                    </div>

                    <h1
                        data-hero-item
                        className="text-4xl font-extrabold tracking-tight sm:text-5xl"
                    >
                        Share Your Study Notes,{" "}
                        <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
                            Empower Fellow Learners.
                        </span>
                    </h1>

                    <p
                        data-hero-item
                        className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-indigo-50/90 sm:text-lg"
                    >
                        Upload slides, handwritten summaries, past test
                        questions, or course cheat sheets to the StudyWise
                        community.
                    </p>
                </div>
            </section>

            {/* FORM CONTAINER - Overlapping Card */}
            <div className="mx-auto -mt-16 max-w-2xl px-4 sm:px-6">
                <div
                    ref={formCardRef}
                    className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-2xl shadow-indigo-950/10 sm:p-10"
                >
                    {/* Top Navigation Row */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-indigo-600"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Library
                        </Link>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                            <GraduationCap className="h-4 w-4" />
                            Document Uploader
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {/* Drag & Drop Zone */}
                        <div className="space-y-2">
                            <Label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                                Document File{" "}
                                <span className="text-indigo-600">*</span>
                            </Label>

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all ${
                                    isDragging
                                        ? "border-indigo-500 bg-indigo-50/80 scale-[0.99]"
                                        : file
                                          ? "border-emerald-300 bg-emerald-50/30"
                                          : "border-slate-200 bg-slate-50/80 hover:border-indigo-400 hover:bg-white"
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {file ? (
                                    <div className="flex w-full items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div className="truncate text-left">
                                                <p className="truncate text-sm font-bold text-slate-900">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="ml-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                            title="Remove file"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110">
                                            <UploadCloud className="h-7 w-7" />
                                        </div>
                                        <p className="mt-4 text-sm font-semibold text-slate-800">
                                            <span className="text-indigo-600 underline underline-offset-2">
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            PDF, DOC, DOCX, PPT, PPTX (up to
                                            25MB)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title Input */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="title"
                                className="text-xs font-bold uppercase tracking-wider text-slate-600"
                            >
                                Document Title{" "}
                                <span className="text-indigo-600">*</span>
                            </Label>
                            <div className="relative">
                                <FileText className={iconClass} />
                                <Input
                                    id="title"
                                    placeholder="e.g. Chapter 4: Linear Algebra Lecture Notes"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={fieldClass}
                                    required
                                />
                            </div>
                        </div>

                        {/* Subject Select */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="subject"
                                className="text-xs font-bold uppercase tracking-wider text-slate-600"
                            >
                                Subject{" "}
                                <span className="text-indigo-600">*</span>
                            </Label>
                            <div className="relative">
                                <BookOpen className={iconClass} />
                                <select
                                    id="subject"
                                    value={subjectId}
                                    onChange={(e) =>
                                        setSubjectId(e.target.value)
                                    }
                                    className="h-14 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-10 text-[15px] text-slate-900 shadow-none transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                    required
                                >
                                    <option value="">
                                        Select an academic subject
                                    </option>
                                    {subjects.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-xs font-bold uppercase tracking-wider text-slate-600"
                            >
                                Description{" "}
                                <span className="text-slate-400 lowercase font-normal">
                                    (optional)
                                </span>
                            </Label>
                            <div className="relative">
                                <AlignLeft className={iconClass} />
                                <Input
                                    id="description"
                                    placeholder="Key topics, exam review tips, or chapter overview..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className={fieldClass}
                                />
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div
                                role="alert"
                                className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600"
                            >
                                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-3">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="group flex h-14 w-full items-center justify-center rounded-full bg-indigo-600 px-6 text-[15px] font-bold text-white shadow-xl shadow-indigo-600/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-2xl active:translate-y-0 disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        <span>Uploading document...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Publish Resource</span>
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
