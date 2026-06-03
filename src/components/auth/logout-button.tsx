"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LogoutButtonProps = {
  redirectTo?: string;
};

export function LogoutButton({ redirectTo = "/dang-nhap" }: LogoutButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="rounded-md border border-[#d5dae2] px-3 py-2 text-xs font-extrabold text-[#384052] hover:border-[#c7352d] hover:text-[#c7352d] disabled:cursor-not-allowed disabled:opacity-65"
    >
      {isSubmitting ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
