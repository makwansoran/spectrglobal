"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Nav } from "@/components/nav";

type Mode = "login" | "request";

export function InvestorsClient() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqName, setReqName] = useState("");
  const [done, setDone] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
  }

  function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <>
      <Nav />
      <main className="flex min-h-[calc(100vh-72px)] flex-col pt-[72px]">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-20">

          {/* Wordmark */}
          <Link href="/" className="mb-12 flex items-center gap-2 hover:opacity-50">
            <Image src="/inzure-logo.png" alt="Spectr" width={24} height={24} className="h-6 w-auto" />
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "0.04em" }}>Spectr</span>
          </Link>

          <div className="w-full max-w-sm">
            {/* Mode toggle */}
            <div className="mb-8 flex border border-border">
              <button
                type="button"
                onClick={() => { setMode("login"); setDone(false); }}
                className={`flex-1 py-2.5 text-sm transition-colors ${
                  mode === "login" ? "bg-fg text-bg" : "text-muted hover:text-fg"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => { setMode("request"); setDone(false); }}
                className={`flex-1 py-2.5 text-sm transition-colors ${
                  mode === "request" ? "bg-fg text-bg" : "text-muted hover:text-fg"
                }`}
              >
                Request access
              </button>
            </div>

            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent pb-2 text-sm outline-none placeholder:text-muted focus:border-fg"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="label">Password</label>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent pb-2 text-sm outline-none placeholder:text-muted focus:border-fg"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full border border-fg bg-fg py-3.5 text-sm text-bg hover:opacity-80"
                >
                  Log in
                </button>
                <p className="text-center text-xs text-muted">
                  Need a customer account?{" "}
                  <button type="button" onClick={() => setMode("request")} className="text-fg underline">
                    Request it
                  </button>
                </p>
              </form>
            )}

            {mode === "request" && !done && (
              <form onSubmit={handleRequest} className="space-y-5">
                <p className="text-sm text-muted">
                  Customer access is available for order tracking, business quotes,
                  and saved drone recommendations.
                </p>
                <div className="flex flex-col gap-1.5">
                  <label className="label">Full name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ada Lovelace"
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                    className="w-full bg-transparent pb-2 text-sm outline-none placeholder:text-muted focus:border-fg"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={reqEmail}
                    onChange={(e) => setReqEmail(e.target.value)}
                    className="w-full bg-transparent pb-2 text-sm outline-none placeholder:text-muted focus:border-fg"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full border border-fg bg-fg py-3.5 text-sm text-bg hover:opacity-80"
                >
                  Request access
                </button>
              </form>
            )}

            {mode === "request" && done && (
              <div className="space-y-3">
                <h2 className="display text-2xl">Request received.</h2>
                <p className="text-sm text-muted">
                  A Spectr product specialist will review your request and be in
                  touch within 2 business days.
                </p>
                <button
                  type="button"
                  onClick={() => { setMode("login"); setDone(false); }}
                  className="text-sm text-fg underline"
                >
                  Back to login
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
