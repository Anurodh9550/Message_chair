"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../context/StoreContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login(email, password);
    setMessage(result.message);
    if (result.ok) {
      router.push("/checkout");
    }
  };

  return (
    <section className="mx-auto w-[95%] max-w-[520px] py-14">
      <div className="rounded-xl border border-[#d9ebdc] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#4f3a35]">User Login</h1>
        <p className="mt-2 text-sm text-[#5b4740]">
          Login to continue checkout and payment.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[#5b4740]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#cfe2d2] px-3 py-2 outline-none focus:border-[#5b4740]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#5b4740]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#cfe2d2] px-3 py-2 outline-none focus:border-[#5b4740]"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#4f3a35] px-4 py-2.5 text-white transition hover:bg-[#5b4740]"
          >
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-[#5b4740]">{message}</p>}
      </div>
    </section>
  );
}
