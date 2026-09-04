"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/resources`)
            .then((res) => res.json())
            .then((data) => setResources(data.resources || []))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return <p className="text-center mt-16 text-gray-500">Loading...</p>;

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Browse Resources</h1>

            {resources.length === 0 ? (
                <p className="text-gray-500">No resources uploaded yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {resources.map((r) => (
                        <Link
                            key={r.id}
                            href={`/resources/${r.id}`}
                            className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
                        >
                            <div className="h-40 bg-gray-100 flex items-center justify-center">
                                {r.thumbnailUrl ? (
                                    <img
                                        src={r.thumbnailUrl}
                                        alt={r.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <FileText className="w-10 h-10 text-gray-400" />
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className="font-semibold truncate">
                                    {r.title}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {r.subject?.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    by {r.user?.name} · {r.votes?.length || 0}{" "}
                                    votes
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
