"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../context/StoreContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, forgotPassword } = useStore();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popup, setPopup] = useState<{ text: string; ok: boolean } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result =
      mode === "login"
        ? await login(email, password)
        : mode === "register"
          ? await register(name, email, password)
          : await forgotPassword(email, password, confirmPassword);
    setPopup({ text: result.message, ok: result.ok });
    if (result.ok) {
      if (mode === "forgot") {
        setMode("login");
      } else {
        router.push("/checkout");
      }
    }
  };

  return (
    <section className="mx-auto w-[95%] max-w-[520px] py-14">
      {popup ? (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm shadow ${
            popup.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p>{popup.text}</p>
            <button
              type="button"
              onClick={() => setPopup(null)}
              className="rounded px-2 py-0.5 text-xs opacity-80 hover:opacity-100"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
      <div className="rounded-xl border border-[#f0dccd] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#4b2e2b]">
          {mode === "login"
            ? "User Login"
            : mode === "register"
              ? "Create Account"
              : "Forgot Password"}
        </h1>
        <p className="mt-2 text-sm text-[#6b4a3f]">
          {mode === "login"
            ? "Login to continue checkout and payment."
            : mode === "register"
              ? "Register to save your account and continue checkout."
              : "Reset your password using your registered email."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" ? (
            <div>
              <label className="mb-1 block text-sm text-[#6b4a3f]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#f0dccd] px-3 py-2 outline-none focus:border-[#7a4b2f]"
                placeholder="Your name"
              />
            </div>
          ) : null}
          <div>
            <label className="mb-1 block text-sm text-[#6b4a3f]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#f0dccd] px-3 py-2 outline-none focus:border-[#7a4b2f]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#6b4a3f]">
              {mode === "forgot" ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#f0dccd] px-3 py-2 outline-none focus:border-[#7a4b2f]"
              placeholder="********"
            />
          </div>
          {mode === "forgot" ? (
            <div>
              <label className="mb-1 block text-sm text-[#6b4a3f]">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-[#f0dccd] px-3 py-2 outline-none focus:border-[#7a4b2f]"
                placeholder="********"
              />
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#7a4b2f] px-4 py-2.5 text-white transition hover:bg-[#5c3722]"
          >
            {mode === "login"
              ? "Login"
              : mode === "register"
                ? "Register"
                : "Reset Password"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => {
              setMode((prev) => (prev === "login" ? "register" : "login"));
              setPopup(null);
            }}
            className="font-medium text-[#7a4b2f] underline"
          >
            {mode === "login" ? "New user? Register here" : "Back to Login"}
          </button>
          {mode !== "forgot" ? (
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setPopup(null);
              }}
              className="font-medium text-[#7a4b2f] underline"
            >
              Forgot Password?
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
