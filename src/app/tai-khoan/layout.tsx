import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/logout-button";

const accountNavItems = [
  { label: "Tin đăng", href: "/tai-khoan/tin-dang" },
  { label: "Tạo tin mới", href: "/tai-khoan/tin-dang/tao-moi" },
  { label: "Khách liên hệ", href: "/tai-khoan/leads" },
];

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/dang-nhap?next=/tai-khoan/tin-dang");
  }

  const displayName = currentSession.user.profile?.displayName ?? currentSession.user.email ?? currentSession.user.phone ?? "Tài khoản";

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#1f2430]">
      <header className="border-b border-[#dde1e7] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1320px] items-center justify-between gap-6 px-6">
          <Link href="/tai-khoan/tin-dang" className="text-lg font-extrabold tracking-normal text-[#c7352d]">
            Tài khoản Anshome
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-bold">{displayName}</p>
              <p className="truncate text-xs text-[#6c7280]">Không gian quản lý tin đăng</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[210px_minmax(0,1fr)]">
        <aside className="min-h-[calc(100vh-65px)] border-r border-[#dde1e7] bg-white px-3 py-5">
          <nav className="grid gap-1">
            {accountNavItems.map((item) => (
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
