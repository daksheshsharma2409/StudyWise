"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, BookOpen, Loader2, Lock, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AuthSwitch() {
    const router = useRouter();
    const cardRef = useRef(null);
    const formSheetRef = useRef(null);
    const loginFormRef = useRef(null);
    const registerFormRef = useRef(null);
    const signupPromptRef = useRef(null);
    const loginPromptRef = useRef(null);
    const timelineRef = useRef(null);
    const hasMounted = useRef(false);

    const [mode, setMode] = useState("login");
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isLogin = mode === "login";

    useGSAP(
        () => {
            const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
            const sheetTarget = isDesktop && isLogin ? 61.29 : 0;
            const incomingForm = isLogin
                ? loginFormRef.current
                : registerFormRef.current;
            const outgoingForm = isLogin
                ? registerFormRef.current
                : loginFormRef.current;
            const incomingPrompt = isLogin
                ? signupPromptRef.current
                : loginPromptRef.current;
            const outgoingPrompt = isLogin
                ? loginPromptRef.current
                : signupPromptRef.current;
            const incomingItems =
                incomingPrompt.querySelectorAll("[data-prompt-item]");
            const outgoingItems =
                outgoingPrompt.querySelectorAll("[data-prompt-item]");
            const formStartX = isLogin ? 38 : -38;

            timelineRef.current?.kill();

            if (!hasMounted.current) {
                gsap.set(formSheetRef.current, { xPercent: sheetTarget });
                gsap.set(incomingForm, { autoAlpha: 1, x: 0, scale: 1 });
                gsap.set(outgoingForm, {
                    autoAlpha: 0,
                    x: -formStartX,
                    scale: 0.985,
                });
                gsap.set(incomingPrompt, {
                    autoAlpha: isDesktop ? 1 : 0,
                    x: 0,
                });
                gsap.set(outgoingPrompt, { autoAlpha: 0, x: -formStartX });
                gsap.set(incomingItems, { autoAlpha: 1, y: 0 });
                gsap.set(outgoingItems, { autoAlpha: 0, y: -14 });
                hasMounted.current = true;
                return;
            }

            const timeline = gsap.timeline({
                defaults: { ease: "power3.out" },
            });
            timelineRef.current = timeline;

            timeline
                .to(
                    formSheetRef.current,
                    {
                        xPercent: sheetTarget,
                        duration: 1.05,
                        ease: "power4.inOut",
                    },
                    0,
                )
                .to(
                    outgoingForm,
                    {
                        autoAlpha: 0,
                        x: -formStartX,
                        scale: 0.985,
                        duration: 0.24,
                    },
                    0,
                )
                .to(
                    outgoingPrompt,
                    { autoAlpha: 0, x: -formStartX, duration: 0.24 },
                    0,
                )
                .to(
                    outgoingItems,
                    { autoAlpha: 0, y: -14, duration: 0.16, stagger: 0.025 },
                    0,
                )
                .fromTo(
                    incomingForm,
                    { autoAlpha: 0, x: formStartX, scale: 0.985 },
                    { autoAlpha: 1, x: 0, scale: 1, duration: 0.52 },
                    0.3,
                )
                .fromTo(
                    incomingPrompt,
                    { autoAlpha: 0, x: formStartX },
                    { autoAlpha: isDesktop ? 1 : 0, x: 0, duration: 0.5 },
                    0.38,
                )
                .fromTo(
                    incomingItems,
                    { autoAlpha: 0, y: 22 },
                    { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.075 },
                    0.48,
                );
        },
        { scope: cardRef, dependencies: [isLogin], revertOnUpdate: false },
    );

    function switchMode(nextMode) {
        if (loading || nextMode === mode) return;
        setError("");
        setMode(nextMode);
    }

    // --- BACKEND LOGIC (UNTOUCHED) ---
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

    const fieldClass =
        "h-14 rounded-xl border border-slate-200 bg-slate-50 pl-12 text-[15px] text-slate-900 shadow-none placeholder:text-slate-400 transition-all focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-100";
    const iconClass =
        "pointer-events-none absolute left-4 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-indigo-400";
    const formClass =
        "absolute inset-0 flex items-center px-7 pb-10 pt-24 opacity-0 sm:px-12 lg:px-16 lg:pb-0 lg:pt-0";

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_#8e9aff_0,_#6874df_34%,_#5b4eaa_100%)] p-3 sm:p-6">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#a78bfa]/25 blur-3xl" />

            <section
                ref={cardRef}
                className="relative h-[680px] w-full max-w-[1180px] overflow-hidden rounded-[2rem] border border-white/30 bg-gradient-to-br from-[#6274e7] via-[#665dcd] to-[#7657b6] shadow-[0_32px_90px_rgba(30,23,93,0.34)] sm:h-[720px] lg:h-[680px]"
            >
                <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[42px] border-white/[0.09]" />
                <div className="pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full border-[50px] border-white/[0.07]" />
                <div className="pointer-events-none absolute left-[22%] top-[22%] h-3 w-3 rounded-full bg-white/85 shadow-[0_0_0_10px_rgba(255,255,255,.09),0_0_0_20px_rgba(255,255,255,.05)]" />

                <aside
                    ref={signupPromptRef}
                    className="absolute inset-y-0 left-0 z-10 hidden w-[38%] items-center justify-center px-12 text-center text-white lg:flex"
                >
                    <div className="max-w-[320px]">
                        <span
                            data-prompt-item
                            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner shadow-white/10"
                        >
                            <BookOpen className="h-8 w-8" />
                        </span>
                        <p
                            data-prompt-item
                            className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-100"
                        >
                            New here?
                        </p>
                        <h2
                            data-prompt-item
                            className="mt-4 text-4xl font-bold leading-tight"
                        >
                            A better rhythm starts today.
                        </h2>
                        <p
                            data-prompt-item
                            className="mt-5 text-base leading-7 text-indigo-50/85"
                        >
                            Create your space, simplify your study routine, and
                            make real progress.
                        </p>
                        <button
                            data-prompt-item
                            type="button"
                            onClick={() => switchMode("register")}
                            className="group mt-9 inline-flex h-[3.25rem] items-center rounded-full border-2 border-white bg-white/5 px-7 text-sm font-bold text-white transition-all hover:bg-white hover:text-indigo-700"
                        >
                            Create account
                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </aside>

                <aside
                    ref={loginPromptRef}
                    className="absolute inset-y-0 right-0 z-10 hidden w-[38%] items-center justify-center px-12 text-center text-white lg:flex"
                >
                    <div className="max-w-[320px]">
                        <span
                            data-prompt-item
                            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner shadow-white/10"
                        >
                            <BookOpen className="h-8 w-8" />
                        </span>
                        <p
                            data-prompt-item
                            className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-100"
                        >
                            Welcome back
                        </p>
                        <h2
                            data-prompt-item
                            className="mt-4 text-4xl font-bold leading-tight"
                        >
                            Your focus is waiting.
                        </h2>
                        <p
                            data-prompt-item
                            className="mt-5 text-base leading-7 text-indigo-50/85"
                        >
                            Pick up where you left off and keep your momentum
                            moving.
                        </p>
                        <button
                            data-prompt-item
                            type="button"
                            onClick={() => switchMode("login")}
                            className="group mt-9 inline-flex h-[3.25rem] items-center rounded-full border-2 border-white bg-white/5 px-7 text-sm font-bold text-white transition-all hover:bg-white hover:text-indigo-700"
                        >
                            Sign in instead
                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </aside>

                <div
                    ref={formSheetRef}
                    className="absolute inset-y-0 left-0 z-20 w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_0_48px_rgba(29,28,92,0.16)] lg:w-[62%]"
                >
                    <div className="pointer-events-none absolute -right-28 top-16 h-72 w-72 rounded-full bg-indigo-50" />
                    <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border-[36px] border-slate-50" />

                    <div className="absolute right-6 top-6 z-20 flex rounded-full bg-slate-100 p-1 lg:hidden">
                        <button
                            type="button"
                            onClick={() => switchMode("login")}
                            aria-pressed={isLogin}
                            className={cn(
                                "rounded-full px-4 py-2 text-xs font-bold transition-colors",
                                isLogin
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-500",
                            )}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            onClick={() => switchMode("register")}
                            aria-pressed={!isLogin}
                            className={cn(
                                "rounded-full px-4 py-2 text-xs font-bold transition-colors",
                                !isLogin
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-500",
                            )}
                        >
                            Sign up
                        </button>
                    </div>

                    <form
                        ref={registerFormRef}
                        onSubmit={handleRegister}
                        className={cn(
                            formClass,
                            !isLogin
                                ? "pointer-events-auto"
                                : "pointer-events-none",
                        )}
                        aria-hidden={isLogin}
                    >
                        <div className="mx-auto w-full max-w-[410px]">
                            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-indigo-500">
                                Get started
                            </p>
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.7rem]">
                                Create account
                            </h1>
                            <p className="mt-3 text-[15px] leading-6 text-slate-500">
                                Everything you need for a more focused study
                                routine.
                            </p>
                            <div className="mt-9 space-y-4">
                                <div className="relative">
                                    <User className={iconClass} />
                                    <Input
                                        aria-label="Name"
                                        autoComplete="name"
                                        placeholder="Your name"
                                        value={registerData.name}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                name: e.target.value,
                                            })
                                        }
                                        className={fieldClass}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className={iconClass} />
                                    <Input
                                        aria-label="Email address"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Email address"
                                        value={registerData.email}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                email: e.target.value,
                                            })
                                        }
                                        className={fieldClass}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className={iconClass} />
                                    <Input
                                        aria-label="Password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Create a password"
                                        value={registerData.password}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                password: e.target.value,
                                            })
                                        }
                                        className={fieldClass}
                                        required
                                    />
                                </div>
                            </div>
                            {error && !isLogin && (
                                <p
                                    role="alert"
                                    className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                                >
                                    {error}
                                </p>
                            )}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="group mt-6 flex h-14 w-full rounded-xl bg-indigo-600 px-5 text-[15px] font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl active:translate-y-0"
                            >
                                {loading && (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                )}
                                {loading
                                    ? "Creating account..."
                                    : "Create account"}
                                {!loading && (
                                    <ArrowRight className="ml-auto h-5 w-5 transition-transform group-hover:translate-x-1" />
                                )}
                            </Button>
                            <p className="mt-7 text-center text-sm text-slate-500 lg:hidden">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode("login")}
                                    className="font-bold text-indigo-600 hover:underline"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>

                    <form
                        ref={loginFormRef}
                        onSubmit={handleLogin}
                        className={cn(
                            formClass,
                            isLogin
                                ? "pointer-events-auto"
                                : "pointer-events-none",
                        )}
                        aria-hidden={!isLogin}
                    >
                        <div className="mx-auto w-full max-w-[410px]">
                            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-indigo-500">
                                Welcome back
                            </p>
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.7rem]">
                                Sign in
                            </h1>
                            <p className="mt-3 text-[15px] leading-6 text-slate-500">
                                Continue where you left off and keep your
                                momentum.
                            </p>
                            <div className="mt-9 space-y-4">
                                <div className="relative">
                                    <Mail className={iconClass} />
                                    <Input
                                        aria-label="Email address"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Email address"
                                        value={loginData.email}
                                        onChange={(e) =>
                                            setLoginData({
                                                ...loginData,
                                                email: e.target.value,
                                            })
                                        }
                                        className={fieldClass}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className={iconClass} />
                                    <Input
                                        aria-label="Password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        value={loginData.password}
                                        onChange={(e) =>
                                            setLoginData({
                                                ...loginData,
                                                password: e.target.value,
                                            })
                                        }
                                        className={fieldClass}
                                        required
                                    />
                                </div>
                            </div>
                            {error && isLogin && (
                                <p
                                    role="alert"
                                    className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                                >
                                    {error}
                                </p>
                            )}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="group mt-6 flex h-14 w-full rounded-xl bg-indigo-600 px-5 text-[15px] font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl active:translate-y-0"
                            >
                                {loading && (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                )}
                                {loading ? "Signing in..." : "Sign in"}
                                {!loading && (
                                    <ArrowRight className="ml-auto h-5 w-5 transition-transform group-hover:translate-x-1" />
                                )}
                            </Button>
                            <p className="mt-7 text-center text-sm text-slate-500 lg:hidden">
                                New to StudyWise?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode("register")}
                                    className="font-bold text-indigo-600 hover:underline"
                                >
                                    Create an account
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}
