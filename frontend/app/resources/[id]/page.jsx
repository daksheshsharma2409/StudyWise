"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileViewer } from "@/components/file-viewer";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResourceDetailPage() {
    const { id } = useParams();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/api/resources/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Resource not found.");
                return res.json();
            })
            .then((data) => setResource(data.resource))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading)
        return <p className="text-center mt-16 text-gray-500">Loading...</p>;
    if (error) return <p className="text-center mt-16 text-red-500">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-2">{resource.title}</h1>
                {resource.description && (
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                )}
                <p className="text-sm text-gray-500 mb-1">
                    Subject: {resource.subject?.name}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                    Uploaded by: {resource.user?.name}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    {resource.views} views - {resource.votes?.length || 0} votes
                </p>

                <FileViewer resource={resource} />

                <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm text-indigo-500 hover:underline"
                >
                    Open in new tab
                </a>
            </div>
        </div>
    );
}
