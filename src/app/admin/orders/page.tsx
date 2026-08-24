import { db } from "@/lib/db";
import { confirmOrderPayment } from "@/app/tai-khoan/goi-dang-tin/package-actions";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import type { OrderStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const numberFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

const statusStyle: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ thanh toán", className: "border-[#f3d38b] bg-[#fff8e8] text-[#8a5a00]" },
  paid: { label: "Đã thanh toán", className: "border-[#9bd8bd] bg-[#ebfbf3] text-[#16794f]" },
  cancelled: { label: "Đã hủy", className: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]" },
  refunded: { label: "Hoàn tiền", className: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]" },
};

const orderStatuses: Array<OrderStatus | ""> = ["", "pending", "paid", "cancelled", "refunded"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = params.status && statusStyle[params.status] ? (params.status as OrderStatus) : null;

  const where = status ? { status } : {};
  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: 200,
      include: {
        user: {
          include: {
            profile: { select: { displayName: true } },
          },
        },
        package: { select: { name: true } },
      },
    }),
    db.order.count({ where }),
  ]);

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Gói & đơn hàng</p>
        <h1 className="mt-1 text-2xl font-extrabold">Đơn hàng</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
          Xác nhận thanh toán chuyển khoản để kích hoạt quyền lợi gói cho người dùng.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-md border border-[#dde1e7] bg-white p-3">
        <form className="flex items-center gap-2">
          <AutoSubmitSelect
            name="status"
            defaultValue={status ?? ""}
            options={orderStatuses.map((item) => ({
              value: item,
              label: item ? statusStyle[item].label : "Tất cả trạng thái",
            }))}
            className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold text-[#1f2430]"
          />
        </form>
        <span className="text-sm font-bold text-[#5f6675]">Tổng: {total}</span>
      </div>

      <div className="overflow-x-auto rounded-md border border-[#dde1e7] bg-white">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
          <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
            <tr>
              <th className="px-4 py-3">Người mua</th>
              <th className="px-4 py-3">Gói</th>
              <th className="px-4 py-3 text-right">Số tiền</th>
              <th className="px-4 py-3">Phương thức</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thanh toán lúc</th>
              <th className="px-4 py-3">Hết hạn</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f3]">
            {orders.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[#6c7280]" colSpan={8}>
                  Không có đơn hàng nào.
                </td>
              </tr>
            ) : null}
            {orders.map((order) => {
              const style = statusStyle[order.status] ?? statusStyle.pending;

              return (
                <tr key={order.id} className="align-top hover:bg-[#fafbfc]">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#1f2430]">{order.user.profile?.displayName ?? order.user.email ?? order.user.phone ?? "Người dùng"}</p>
                    <p className="mt-1 font-mono text-xs text-[#6c7280]">{order.id}</p>
                  </td>
                  <td className="px-4 py-3">{order.package.name}</td>
                  <td className="px-4 py-3 text-right font-extrabold">{numberFormatter.format(Number(order.amount.toString()))} đ</td>
                  <td className="px-4 py-3 text-[#5f6675]">{order.paymentMethod ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex min-h-7 items-center rounded-md border px-2.5 py-1 text-xs font-extrabold ${style.className}`}>
                      {style.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#5f6675]">{order.paidAt?.toISOString().slice(0, 16).replace("T", " ") ?? "-"}</td>
                  <td className="px-4 py-3 text-[#5f6675]">{order.expiresAt?.toISOString().slice(0, 10) ?? "-"}</td>
                  <td className="px-4 py-3">
                    {order.status === "pending" ? (
                      <form action={confirmOrderPayment}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <button type="submit" className="rounded-md bg-[#16794f] px-3 py-1.5 text-xs font-extrabold text-white">
                          Xác nhận đã thanh toán
                        </button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}