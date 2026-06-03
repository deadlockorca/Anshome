import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PublicAuthPage } from "@/components/auth/public-auth-page";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đăng nhập | Anshome",
  description: "Đăng nhập hoặc đăng ký tài khoản Anshome để lưu tin, đăng tin và quản lý khách liên hệ.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; mode?: string }>;
}) {
  const [{ next, mode }, currentSession] = await Promise.all([searchParams, getCurrentSession()]);
  const nextPath = normalizeNextPath(next);

  if (currentSession) {
    redirect(nextPath ?? "/tai-khoan/tin-dang");
  }

  return <PublicAuthPage initialMode={mode === "register" ? "register" : "login"} nextPath={nextPath ?? undefined} />;
}

function normalizeNextPath(value: string | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}
