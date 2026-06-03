"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/admin" }: LoginFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("admin@anshome.local");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Đăng nhập không thành công.");
      setIsSubmitting(false);
      return;
    }

    router.replace(safeNextPath(nextPath));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
        Email hoặc số điện thoại
        <input
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          required
          autoComplete="username"
          className="rounded-md border border-[#d5dae2] bg-white px-3 py-2.5 text-sm normal-case text-[#1f2430] outline-none ring-[#c7352d]/20 focus:ring-4"
        />
      </label>
      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
        Mật khẩu
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          type="password"
          autoComplete="current-password"
          className="rounded-md border border-[#d5dae2] bg-white px-3 py-2.5 text-sm normal-case text-[#1f2430] outline-none ring-[#c7352d]/20 focus:ring-4"
        />
      </label>
      {error ? <p className="rounded-md border border-[#f1b8b4] bg-[#fff4f2] px-3 py-2 text-sm font-bold text-[#a62b24]">{error}</p> : null}
      <button disabled={isSubmitting} className="rounded-md bg-[#c7352d] px-4 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-65" type="submit">
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}

function safeNextPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/admin";
  }

  return path;
}
