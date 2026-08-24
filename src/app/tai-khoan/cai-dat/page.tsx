import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { changePassword, updateProfile } from "@/app/tai-khoan/cai-dat/settings-actions";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/dang-nhap?next=/tai-khoan/cai-dat");
  }

  const [profile, user] = await Promise.all([
    db.profile.findUnique({
      where: { userId: currentSession.user.id },
    }),
    db.user.findUnique({
      where: { id: currentSession.user.id },
      select: { email: true, phone: true, emailVerifiedAt: true, phoneVerifiedAt: true },
    }),
  ]);

  const displayName = profile?.displayName ?? currentSession.user.profile?.displayName ?? "";

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Tài khoản</p>
        <h1 className="mt-1 text-2xl font-extrabold">Cài đặt tài khoản</h1>
        <p className="mt-2 text-sm leading-6 text-[#5f6675]">Cập nhật thông tin hiển thị công khai và bảo mật tài khoản.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-md border border-[#dde1e7] bg-white p-4">
          <h2 className="text-base font-extrabold">Thông tin hiển thị</h2>
          <form action={updateProfile} className="mt-4 grid gap-3">
            <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
              Tên hiển thị
              <input name="displayName" required defaultValue={displayName} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
              Công ty (nếu là môi giới)
              <input name="companyName" defaultValue={profile?.companyName ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
              Số giấy phép môi giới
              <input name="licenseNumber" defaultValue={profile?.licenseNumber ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
              Giới thiệu ngắn
              <textarea name="bio" rows={4} defaultValue={profile?.bio ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm leading-6 normal-case text-[#1f2430]" />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
              Số điện thoại
              <input name="phone" defaultValue={user?.phone ?? ""} placeholder="09xx xxx xxx" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
            </label>
            <div className="rounded-md border border-[#edf0f3] bg-[#fafbfc] p-3 text-xs font-semibold leading-5 text-[#6c7280]">
              Email: {user?.email ?? "Chưa có"} {user?.emailVerifiedAt ? "· Đã xác thực" : ""}
            </div>
            <div>
              <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white">
                Lưu thông tin
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-md border border-[#dde1e7] bg-white p-4">
          <h2 className="text-base font-extrabold">Đổi mật khẩu</h2>
          <form action={changePassword} className="mt-4 grid gap-3">
            <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
              Mật khẩu hiện tại
              <input name="currentPassword" type="password" required className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
              Mật khẩu mới
              <input name="newPassword" type="password" required minLength={8} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
              Xác nhận mật khẩu mới
              <input name="confirmPassword" type="password" required minLength={8} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
            </label>
            <div>
              <button type="submit" className="rounded-md bg-[#1f2430] px-4 py-2 text-sm font-extrabold text-white">
                Đổi mật khẩu
              </button>
            </div>
          </form>
        </section>
      </div>
    </section>
  );
}
