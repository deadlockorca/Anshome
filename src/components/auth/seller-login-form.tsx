"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SellerLoginFormProps = {
  returnUrl: string;
};

type LoginResponse = {
  error?: string;
};

export function SellerLoginForm({ returnUrl }: SellerLoginFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const body = (await response.json().catch(() => null)) as LoginResponse | null;

    if (!response.ok) {
      setError(body?.error ?? "Đăng nhập không thành công.");
      setIsSubmitting(false);
      return;
    }

    router.replace(safeReturnUrl(returnUrl));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="seller-login-form">
      <label className="seller-field">
        <span>⌾</span>
        <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="SĐT chính hoặc email" autoComplete="username" required />
      </label>
      <label className="seller-field">
        <span>▣</span>
        <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mật khẩu" type="password" autoComplete="current-password" minLength={8} required />
      </label>
      {error ? <p className="seller-error">{error}</p> : null}
      <button type="submit" className="seller-primary" disabled={isSubmitting}>
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}

function safeReturnUrl(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/tai-khoan/tin-dang/tao-moi";
  }

  return value;
}
