import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { adminRoleCodes } from "@/lib/auth/roles";
import { getCurrentSession, hasRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị | Anshome",
  description: "Đăng nhập khu vực quản trị Anshome.",
};

const featureCards = ["Phân loại", "Kiểm duyệt tin đăng", "Nhật ký hoạt động"];

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, currentSession] = await Promise.all([searchParams, getCurrentSession()]);
  const nextPath = normalizeAdminNextPath(next);

  if (currentSession) {
    if (!hasRole(currentSession, adminRoleCodes)) {
      redirect("/khong-co-quyen");
    }

    redirect(nextPath);
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] px-6 py-10 text-[#1f2430]">
      <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1120px] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Quản trị Anshome</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight text-[#1f2430]">
            Truy cập khu vực kiểm duyệt, dữ liệu nền và vận hành hệ thống.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5f6675]">
            Trang này chỉ dành cho tài khoản có quyền quản trị như kiểm duyệt viên, vận hành hoặc quản trị toàn quyền.
          </p>
          <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
            {featureCards.map((item) => (
              <div key={item} className="rounded-md border border-[#dde1e7] bg-white p-4">
                <p className="text-sm font-extrabold text-[#1f2430]">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-[#dde1e7] bg-white p-5 shadow-[0_18px_50px_rgba(20,28,45,0.08)]">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Đăng nhập quản trị</p>
            <h2 className="mt-1 text-2xl font-extrabold">Truy cập bảng quản trị</h2>
            <p className="mt-2 text-sm leading-6 text-[#6c7280]">
              Tài khoản mẫu đã được điền sẵn để kiểm thử trên máy cục bộ.
            </p>
          </div>
          <LoginForm nextPath={nextPath} />
        </div>
      </section>
    </main>
  );
}

function normalizeAdminNextPath(value: string | undefined): string {
  if (!value || !value.startsWith("/admin") || value.startsWith("//")) {
    return "/admin";
  }

  return value;
}
