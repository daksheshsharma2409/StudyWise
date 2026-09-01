"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AuthSwitch() {
    const router = useRouter();
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(loginData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");
            setMode("login");
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-indigo-700 p-4">
            <div className="relative w-full max-w-3xl h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
                {/* Colored side panel */}
                <div className="hidden md:flex flex-col items-center justify-center text-center text-white w-1/2 p-10 bg-indigo-500 [clip-path:polygon(0_0,85%_0,65%_100%,0%_100%)]">
                    {mode === "login" ? (
                        <>
                            <h2 className="text-2xl font-bold mb-3">
                                New here?
                            </h2>
                            <p className="text-sm mb-6 opacity-90">
                                Join us today and discover a world of
                                possibilities. Create your account in seconds!
                            </p>
                            <Button
                                variant="outline"
                                className="rounded-full border-white text-white bg-transparent hover:bg-white hover:text-indigo-600"
                                onClick={() => setMode("register")}
                            >
                                Sign Up
                            </Button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-3">
                                One of us?
                            </h2>
                            <p className="text-sm mb-6 opacity-90">
                                Already have an account? Sign back in and pick
                                up right where you left off.
                            </p>
                            <Button
                                variant="outline"
                                className="rounded-full border-white text-white bg-transparent hover:bg-white hover:text-indigo-600"
                                onClick={() => setMode("login")}
                            >
                                Sign In
                            </Button>
                        </>
                    )}
                </div>

                {/* Form side */}
                <div className="flex-1 flex flex-col justify-center px-8 md:px-16">
                    <h1 className="text-3xl font-bold text-center mb-8">
                        {mode === "login" ? "Sign in" : "Sign up"}
                    </h1>

                    {mode === "login" ? (
                        <form
                            onSubmit={handleLogin}
                            className="flex flex-col gap-4"
                        >
                            <Input
                                type="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        email: e.target.value,
                                    })
                                }
                                className="rounded-full bg-gray-100 border-none px-5 py-5"
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        password: e.target.value,
                                    })
                                }
                                className="rounded-full bg-gray-100 border-none px-5 py-5"
                                required
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="rounded-full mt-2 py-5 bg-indigo-500 hover:bg-indigo-600"
                            >
                                {loading ? "Logging in..." : "LOGIN"}
                            </Button>
                        </form>
                    ) : (
                        <form
                            onSubmit={handleRegister}
                            className="flex flex-col gap-4"
                        >
                            <Input
                                placeholder="Name"
                                value={registerData.name}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        name: e.target.value,
                                    })
                                }
                                className="rounded-full bg-gray-100 border-none px-5 py-5"
                                required
                            />
                            <Input
                                type="email"
                                placeholder="Email"
                                value={registerData.email}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        email: e.target.value,
                                    })
                                }
                                className="rounded-full bg-gray-100 border-none px-5 py-5"
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={registerData.password}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        password: e.target.value,
                                    })
                                }
                                className="rounded-full bg-gray-100 border-none px-5 py-5"
                                required
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="rounded-full mt-2 py-5 bg-indigo-500 hover:bg-indigo-600"
                            >
                                {loading ? "Creating account..." : "SIGN UP"}
                            </Button>
                        </form>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm text-center mt-4">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
