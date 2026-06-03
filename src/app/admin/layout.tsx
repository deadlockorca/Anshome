import Link from "next/link";
import { redirect } from "next/navigation";
import { adminRoleCodes } from "@/lib/auth/roles";
import { getCurrentSession, hasRole } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/logout-button";

const adminNavItems = [
  { label: "Bảng điều khiển", href: "/admin" },
  { label: "Người dùng", href: "/admin/users" },
  { label: "Tin đăng", href: "/admin/listings" },
  { label: "Khu vực", href: "/admin/locations" },
  { label: "Danh mục", href: "/admin/categories" },
  { label: "Nhật ký hoạt động", href: "/admin/audit-logs" },
];

const roleLabel: Record<string, string> = {
  moderator: "Kiểm duyệt viên",
  editor: "Biên tập viên",
  ops: "Vận hành",
  super_admin: "Quản trị toàn quyền",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/quan-tri/dang-nhap?next=/admin");
  }

  if (!hasRole(currentSession, adminRoleCodes)) {
    redirect("/khong-co-quyen");
  }

  const displayName = currentSession.user.profile?.displayName ?? currentSession.user.email ?? currentSession.user.phone ?? "Quản trị viên";
  const roleLabels = currentSession.user.roles.map(({ role }) => roleLabel[role.code] ?? role.code).join(", ");

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#1f2430]">
      <header className="border-b border-[#dde1e7] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between gap-6 px-6">
          <Link href="/admin" className="text-lg font-extrabold tracking-normal text-[#c7352d]">
            Quản trị Anshome
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-bold">{displayName}</p>
              <p className="truncate text-xs text-[#6c7280]">{roleLabels}</p>
            </div>
            <LogoutButton redirectTo="/quan-tri/dang-nhap" />
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[220px_minmax(0,1fr)]">
        <aside className="min-h-[calc(100vh-65px)] border-r border-[#dde1e7] bg-white px-3 py-5">
          <nav className="grid gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-bold text-[#384052] hover:bg-[#f0f2f5] hover:text-[#c7352d]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
