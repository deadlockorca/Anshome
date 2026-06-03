import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Prisma, RoleCode, UserStatus } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { updateUserRoles, updateUserStatus } from "@/app/admin/users/user-actions";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string | string[];
  status?: string | string[];
  role?: string | string[];
};

const statusOptions: Array<{ value: UserStatus; label: string }> = [
  { value: "active", label: "Đang hoạt động" },
  { value: "suspended", label: "Tạm khóa" },
  { value: "deleted", label: "Đã xóa" },
];

const roleOptions: Array<{ value: RoleCode; label: string }> = [
  { value: "seeker", label: "Người tìm nhà" },
  { value: "owner", label: "Chủ nhà / đăng tin" },
  { value: "agent", label: "Môi giới" },
  { value: "agency_admin", label: "Quản trị đại lý" },
  { value: "developer", label: "Chủ đầu tư" },
  { value: "moderator", label: "Kiểm duyệt viên" },
  { value: "editor", label: "Biên tập viên" },
  { value: "ops", label: "Vận hành" },
  { value: "super_admin", label: "Quản trị toàn quyền" },
];

const statusValues = new Set<UserStatus>(statusOptions.map((option) => option.value));
const roleValues = new Set<RoleCode>(roleOptions.map((option) => option.value));
const roleLabel = Object.fromEntries(roleOptions.map((option) => [option.value, option.label])) as Record<RoleCode, string>;

function asSingleValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function formatDate(value: Date | null): string {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = asSingleValue(params.q).trim();
  const status = asSingleValue(params.status) as UserStatus;
  const role = asSingleValue(params.role) as RoleCode;

  const where: Prisma.UserWhereInput = {};

  if (q) {
    where.OR = [
      { email: { contains: q } },
      { phone: { contains: q } },
      {
        profile: {
          is: {
            displayName: {
              contains: q,
            },
          },
        },
      },
    ];
  }

  if (statusValues.has(status)) {
    where.status = status;
  }

  if (roleValues.has(role)) {
    where.roles = {
      some: {
        role: {
          code: role,
        },
      },
    };
  }

  const [users, stats] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: 100,
      include: {
        profile: true,
        roles: {
          include: {
            role: true,
          },
        },
        _count: {
          select: {
            listings: true,
            leadsReceived: true,
            leadsSent: true,
            sessions: true,
          },
        },
      },
    }),
    db.user.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),
  ]);

  const statMap = new Map(stats.map((item) => [item.status, item._count._all]));

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Tài khoản</p>
          <h1 className="mt-1 text-2xl font-extrabold">Quản lý người dùng</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Admin quản lý trạng thái tài khoản, phân vai trò truy cập và theo dõi hoạt động cơ bản của người đăng tin, môi giới, khách tìm nhà và nhân sự nội bộ.
          </p>
        </div>
        <p className="text-sm font-bold text-[#384052]">{users.length} kết quả</p>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        {statusOptions.map((option) => (
          <div key={option.value} className="rounded-md border border-[#dde1e7] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-[#6c7280]">{option.label}</p>
            <p className="mt-3 text-3xl font-extrabold">{statMap.get(option.value) ?? 0}</p>
          </div>
        ))}
      </div>

      <form action="/admin/users" className="mb-5 grid gap-3 rounded-md border border-[#dde1e7] bg-white p-4 md:grid-cols-[minmax(260px,1fr)_220px_220px_auto]">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Từ khóa
          <input
            name="q"
            defaultValue={q}
            placeholder="Tên, email hoặc số điện thoại"
            className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Trạng thái
          <select name="status" defaultValue={statusValues.has(status) ? status : ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
            <option value="">Tất cả trạng thái</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Vai trò
          <select name="role" defaultValue={roleValues.has(role) ? role : ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
            <option value="">Tất cả vai trò</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white">
            Lọc
          </button>
          <Link href="/admin/users" className="rounded-md border border-[#d5dae2] px-4 py-2 text-sm font-extrabold text-[#384052]">
            Đặt lại
          </Link>
        </div>
      </form>

      <div className="overflow-x-auto rounded-md border border-[#dde1e7] bg-white">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Người dùng</th>
              <th className="px-4 py-3">Liên hệ</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3 text-right">Tin đăng</th>
              <th className="px-4 py-3 text-right">Lead nhận</th>
              <th className="px-4 py-3">Lần đăng nhập cuối</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {users.map((user) => {
              const selectedRoleCodes = new Set(user.roles.map((userRole) => userRole.role.code));
              const sortedRoles = [...user.roles].sort((a, b) => a.role.code.localeCompare(b.role.code));

              return (
                <tr key={user.id} className="align-top hover:bg-[#fafbfc]">
                  <td className="px-4 py-3">
                    <details>
                      <summary className="cursor-pointer">
                        <span className="block font-bold">{user.profile?.displayName ?? user.email ?? user.phone ?? "Chưa có tên"}</span>
                        <span className="mt-1 block font-mono text-xs text-[#6c7280]">{user.id}</span>
                      </summary>
                      <div className="mt-3 grid w-[860px] gap-4 rounded-md border border-[#dde1e7] bg-[#fafbfc] p-3 md:grid-cols-[240px_minmax(0,1fr)]">
                        <form action={updateUserStatus} className="grid gap-2">
                          <input type="hidden" name="userId" value={user.id} />
                          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
                            Trạng thái tài khoản
                            <select name="status" defaultValue={user.status} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <button type="submit" className="rounded-md bg-[#1f2430] px-4 py-2 text-sm font-extrabold text-white">
                            Lưu trạng thái
                          </button>
                        </form>
                        <form action={updateUserRoles} className="grid gap-3">
                          <input type="hidden" name="userId" value={user.id} />
                          <p className="text-xs font-bold uppercase text-[#6c7280]">Phân quyền</p>
                          <div className="grid gap-2 md:grid-cols-3">
                            {roleOptions.map((option) => (
                              <label key={option.value} className="flex items-center gap-2 rounded-md border border-[#dde1e7] bg-white px-3 py-2 text-sm font-bold text-[#384052]">
                                <input name="roles" type="checkbox" value={option.value} defaultChecked={selectedRoleCodes.has(option.value)} />
                                {option.label}
                              </label>
                            ))}
                          </div>
                          <div>
                            <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white">
                              Lưu vai trò
                            </button>
                          </div>
                        </form>
                      </div>
                    </details>
                  </td>
                  <td className="px-4 py-3">
                    <p>{user.email ?? "-"}</p>
                    <p className="mt-1 text-[#6c7280]">{user.phone ?? "-"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex max-w-[260px] flex-wrap gap-1.5">
                      {sortedRoles.length > 0 ? (
                        sortedRoles.map((userRole) => (
                          <span key={userRole.id} className="rounded-md border border-[#d5dae2] bg-[#f7f7f8] px-2 py-1 text-xs font-bold text-[#384052]">
                            {roleLabel[userRole.role.code] ?? userRole.role.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#6c7280]">Chưa phân quyền</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{user._count.listings}</td>
                  <td className="px-4 py-3 text-right">{user._count.leadsReceived}</td>
                  <td className="px-4 py-3 text-[#5f6675]">{formatDate(user.lastLoginAt)}</td>
                  <td className="px-4 py-3"><StatusBadge value={user.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm font-semibold text-[#6c7280]">Chưa có người dùng phù hợp với bộ lọc.</div>
        ) : null}
      </div>
    </section>
  );
}
