import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const auditLogs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: {
        include: {
          profile: {
            select: {
              displayName: true,
            },
          },
        },
      },
    },
  });

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Quản trị hệ thống</p>
          <h1 className="mt-1 text-2xl font-extrabold">Nhật ký hoạt động</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
            Bản ghi các thao tác quản trị quan trọng. Khi tạo hoặc cập nhật phân loại, dữ liệu trước và sau thay đổi sẽ được lưu tại đây.
          </p>
        </div>
        <p className="text-sm font-bold text-[#384052]">{auditLogs.length} bản ghi mới nhất</p>
      </div>
      <div className="overflow-x-auto rounded-md border border-[#dde1e7] bg-white">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3">Người thao tác</th>
              <th className="px-4 py-3">Hành động</th>
              <th className="px-4 py-3">Đối tượng</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Dữ liệu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="align-top hover:bg-[#fafbfc]">
                <td className="whitespace-nowrap px-4 py-3">{log.createdAt.toISOString()}</td>
                <td className="px-4 py-3 font-bold">
                  {log.actor?.profile?.displayName ?? log.actor?.email ?? log.actor?.phone ?? "-"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                <td className="px-4 py-3">
                  <p className="font-bold">{log.entityType}</p>
                  <p className="font-mono text-xs text-[#6c7280]">{log.entityId}</p>
                </td>
                <td className="px-4 py-3">{log.ipAddress ?? "-"}</td>
                <td className="px-4 py-3">
                  <details>
                    <summary className="cursor-pointer font-bold">Xem JSON</summary>
                    <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-[#111827] p-3 text-xs leading-5 text-white">
                      {JSON.stringify({ before: log.beforeJson, after: log.afterJson }, null, 2)}
                    </pre>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
