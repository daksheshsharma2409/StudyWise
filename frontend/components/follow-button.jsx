"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function FollowButton({ userId, initialFollowing }) {
    const [following, setFollowing] = useState(initialFollowing);
    const [loading, setLoading] = useState(false);

    async function toggleFollow() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/users/${userId}/follow`, {
                method: "POST",
                credentials: "include",
            });
            if (res.status === 401) {
                alert("Please log in to follow users.");
                return;
            }
            const data = await res.json();
            setFollowing(data.following);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={toggleFollow}
            disabled={loading}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
                following
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
        >
            {following ? "Following" : "Follow"}
        </button>
    );
}
