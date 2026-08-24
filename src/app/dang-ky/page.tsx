import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PublicAuthPage } from "@/components/auth/public-auth-page";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đăng ký | Anshome",
  description: "Đăng ký tài khoản Anshome để đăng tin bán, cho thuê nhà đất và quản lý khách liên hệ.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, currentSession] = await Promise.all([searchParams, getCurrentSession()]);
  const nextPath = normalizeNextPath(next);

  if (currentSession) {
    redirect(nextPath ?? "/tai-khoan/tin-dang");
  }

  return <PublicAuthPage initialMode="register" nextPath={nextPath ?? undefined} />;
}

function normalizeNextPath(value: string | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}
