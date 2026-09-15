"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    async function handleLogout() {
        await logout();
        router.push("/login");
    }

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
            <Link href="/" className="font-bold text-lg text-indigo-600">
                StudyWise
            </Link>

            <div className="flex items-center gap-4">
                <Link
                    href="/upload"
                    className="text-sm text-gray-600 hover:text-indigo-600"
                >
                    Upload
                </Link>

                {loading ? null : user ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700">
                            Hi,{" "}
                            <span className="font-semibold">{user.name}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-500 hover:underline"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-indigo-600 hover:underline"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
