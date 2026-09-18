"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { SortSelect } from "@/components/sort-select";
import { FollowButton } from "@/components/follow-button";
import { BadgeCheck, Globe, FileText } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
    const { id } = useParams();
    const { user: currentUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [resources, setResources] = useState([]);
    const [sort, setSort] = useState("recent");
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetch(`${API_URL}/api/users/${id}`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setProfile(data.user);
                setForm({
                    bio: data.user.bio || "",
                    linkedinUrl: data.user.linkedinUrl || "",
                    githubUrl: data.user.githubUrl || "",
                    instagramUrl: data.user.instagramUrl || "",
                    customWebsiteUrl: data.user.customWebsiteUrl || "",
                    qualifications: (data.user.qualifications || []).join(", "),
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        fetch(`${API_URL}/api/users/${id}/resources?sort=${sort}`)
            .then((res) => res.json())
            .then((data) => setResources(data.resources || []));
    }, [id, sort]);

    async function handleSaveProfile(e) {
        e.preventDefault();
        const res = await fetch(`${API_URL}/api/users/me`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                ...form,
                qualifications: form.qualifications
                    .split(",")
                    .map((q) => q.trim())
                    .filter(Boolean),
            }),
        });
        if (res.ok) {
            const data = await res.json();
            setProfile((prev) => ({ ...prev, ...data.user }));
            setEditing(false);
        }
    }

    if (loading)
        return <p className="text-center mt-16 text-gray-500">Loading...</p>;
    if (!profile)
        return (
            <p className="text-center mt-16 text-red-500">User not found.</p>
        );

    return (
        <div className="max-w-3xl mx-auto mt-10 px-4">
            <div className="flex flex-col items-center text-center border rounded-2xl p-8 bg-white shadow-sm">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    {profile.isVerified && (
                        <BadgeCheck className="w-5 h-5 text-blue-500" />
                    )}
                    {profile.role === "admin" && (
                        <span className="text-xs font-semibold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                            Admin
                        </span>
                    )}
                </div>

                {profile.bio && (
                    <p className="text-gray-600 mt-2 max-w-md">{profile.bio}</p>
                )}

                {profile.qualifications?.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                        {profile.qualifications.map((q, i) => (
                            <span
                                key={i}
                                className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                            >
                                {q}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 mt-4">
                    {profile.linkedinUrl && (
                        <a
                            href={profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaLinkedin className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
                        </a>
                    )}
                    {profile.githubUrl && (
                        <a
                            href={profile.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
                        </a>
                    )}
                    {profile.instagramUrl && (
                        <a
                            href={profile.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInstagram className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
                        </a>
                    )}
                    {profile.customWebsiteUrl && (
                        <a
                            href={profile.customWebsiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Globe className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
                        </a>
                    )}
                </div>

                <div className="flex gap-6 mt-5 text-sm text-gray-600">
                    <span>
                        <strong>{profile.resourceCount}</strong> notes
                    </span>
                    <span>
                        <strong>{profile.followerCount}</strong> followers
                    </span>
                    <span>
                        <strong>{profile.followingCount}</strong> following
                    </span>
                    <span>
                        <strong>{profile.reputationScore}</strong> reputation
                    </span>
                </div>

                <div className="mt-5">
                    {profile.isOwnProfile ? (
                        <button
                            onClick={() => setEditing((v) => !v)}
                            className="text-sm font-semibold text-indigo-600 hover:underline"
                        >
                            {editing ? "Cancel" : "Edit Profile"}
                        </button>
                    ) : (
                        currentUser && (
                            <FollowButton
                                userId={profile.id}
                                initialFollowing={profile.isFollowing}
                            />
                        )
                    )}
                </div>

                {editing && (
                    <form
                        onSubmit={handleSaveProfile}
                        className="w-full mt-6 flex flex-col gap-3 text-left"
                    >
                        <label className="text-sm font-medium">Bio</label>
                        <textarea
                            value={form.bio}
                            onChange={(e) =>
                                setForm({ ...form, bio: e.target.value })
                            }
                            className="border rounded-md px-3 py-2 text-sm"
                            rows={3}
                        />
                        <label className="text-sm font-medium">
                            LinkedIn URL
                        </label>
                        <input
                            value={form.linkedinUrl}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    linkedinUrl: e.target.value,
                                })
                            }
                            className="border rounded-md px-3 py-2 text-sm"
                        />
                        <label className="text-sm font-medium">
                            GitHub URL
                        </label>
                        <input
                            value={form.githubUrl}
                            onChange={(e) =>
                                setForm({ ...form, githubUrl: e.target.value })
                            }
                            className="border rounded-md px-3 py-2 text-sm"
                        />
                        <label className="text-sm font-medium">
                            Instagram URL
                        </label>
                        <input
                            value={form.instagramUrl}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    instagramUrl: e.target.value,
                                })
                            }
                            className="border rounded-md px-3 py-2 text-sm"
                        />
                        <label className="text-sm font-medium">
                            Website URL
                        </label>
                        <input
                            value={form.customWebsiteUrl}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    customWebsiteUrl: e.target.value,
                                })
                            }
                            className="border rounded-md px-3 py-2 text-sm"
                        />
                        <label className="text-sm font-medium">
                            Qualifications (comma-separated)
                        </label>
                        <input
                            value={form.qualifications}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    qualifications: e.target.value,
                                })
                            }
                            placeholder="B.Tech CSE, AWS Certified"
                            className="border rounded-md px-3 py-2 text-sm"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full py-2 text-sm font-semibold mt-2"
                        >
                            Save
                        </button>
                    </form>
                )}
            </div>

            <div className="flex items-center justify-between mt-8 mb-4">
                <h2 className="text-lg font-bold">Notes by {profile.name}</h2>
                <SortSelect value={sort} onChange={setSort} />
            </div>

            {resources.length === 0 ? (
                <p className="text-gray-500">No notes uploaded yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {resources.map((r) => (
                        <Link
                            key={r.id}
                            href={`/resources/${r.id}`}
                            className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
                        >
                            <div className="h-32 bg-gray-100 flex items-center justify-center">
                                {r.thumbnailUrl ? (
                                    <img
                                        src={r.thumbnailUrl}
                                        alt={r.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <FileText className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-sm truncate">
                                    {r.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {r.subject?.name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
