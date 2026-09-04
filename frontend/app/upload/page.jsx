"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UploadPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [subjects, setSubjects] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/subjects`)
            .then((res) => res.json())
            .then((data) => setSubjects(data.subjects || []))
            .catch(() => setError("Could not load subjects."));
    }, []);

    function handleDragOver(e) {
        e.preventDefault(); // without this, onDrop never fires — browser wants to open the file instead
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
                body: formData, // no Content-Type header — the browser sets it with the right multipart boundary automatically
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

    return (
        <div className="max-w-lg mx-auto mt-16 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Upload a Resource
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                        isDragging
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300 bg-gray-50"
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
                        <div className="flex items-center justify-center gap-3">
                            <FileText className="w-6 h-6 text-indigo-500" />
                            <span className="text-sm font-medium">
                                {file.name}
                            </span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                }}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                            <UploadCloud className="w-8 h-8" />
                            <p className="text-sm">
                                Drag & drop a file here, or click to browse
                            </p>
                            <p className="text-xs text-gray-400">
                                PDF, DOC, PPT
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <select
                        id="subject"
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm"
                        required
                    >
                        <option value="">Select a subject</option>
                        {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </Button>

                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
            </form>
        </div>
    );
}
