import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { createOrder, payOrderMock } from "@/app/tai-khoan/goi-dang-tin/package-actions";

export const dynamic = "force-dynamic";

const numberFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

function formatPrice(value: { toString(): string }): string {
  const amount = Number(value.toString());
  if (amount === 0) {
    return "Miễn phí";
  }
  return `${numberFormatter.format(amount)} đ`;
}

export default async function ListingPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/dang-nhap?next=/tai-khoan/goi-dang-tin");
  }

  const [packages, orders] = await Promise.all([
    db.listingPackage.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }],
    }),
    db.order.findMany({
      where: { userId: currentSession.user.id },
      orderBy: [{ createdAt: "desc" }],
      take: 20,
      include: {
        package: {
          select: { name: true },
        },
      },
    }),
  ]);

  const pendingOrder = params.order ? orders.find((order) => order.id === params.order && order.status === "pending") : null;

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Nền tảng</p>
        <h1 className="mt-1 text-2xl font-extrabold">Gói đăng tin</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
          Mua gói để làm nổi bật, đẩy tin và làm mới tin đăng. Quyền lợi có hiệu lực theo số ngày của gói.
        </p>
      </div>

      {pendingOrder ? (
        <div className="mb-6 rounded-md border border-[#f3d38b] bg-[#fff8e8] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-[#8a5a00]">Đơn hàng chờ thanh toán: {pendingOrder.package.name}</p>
              <p className="mt-1 text-xs font-semibold text-[#8a5a00]">
                Số tiền {formatPrice(pendingOrder.amount)} · Chuyển khoản ngân hàng · Quản trị viên sẽ xác nhận.
              </p>
            </div>
            <form action={payOrderMock}>
              <input type="hidden" name="orderId" value={pendingOrder.id} />
              <button type="submit" className="rounded-md bg-[#16794f] px-4 py-2 text-sm font-extrabold text-white">
                Thanh toán thử (sandbox)
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {packages.map((pkg) => (
          <article key={pkg.id} className="flex flex-col rounded-md border border-[#dde1e7] bg-white p-5 shadow-[0_14px_40px_rgba(20,28,45,0.04)]">
            <p className="text-xs font-bold uppercase tracking-normal text-[#c7352d]">{pkg.name}</p>
            <p className="mt-3 text-3xl font-extrabold text-[#1f2430]">{formatPrice(pkg.price)}</p>
            <p className="mt-1 text-xs font-semibold text-[#6c7280]">Hiệu lực {pkg.durationDays} ngày</p>
            {pkg.description ? <p className="mt-3 text-sm leading-6 text-[#5f6675]">{pkg.description}</p> : null}
            <ul className="mt-4 grid gap-2 text-sm font-semibold text-[#384052]">
              <li>Nổi bật: {pkg.featuredQuota} tin</li>
              <li>Đẩy tin: {pkg.boostQuota} lượt</li>
              <li>Làm mới: {pkg.refreshQuota} lượt</li>
              {pkg.maxListings != null ? <li>Giới hạn {pkg.maxListings} tin đăng</li> : <li>Không giới hạn tin đăng</li>}
            </ul>
            <form action={createOrder} className="mt-5">
              <input type="hidden" name="packageId" value={pkg.id} />
              <button
                type="submit"
                disabled={Number(pkg.price.toString()) === 0}
                className="w-full rounded-md bg-[#c7352d] px-4 py-2.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:bg-[#d5dae2]"
              >
                {Number(pkg.price.toString()) === 0 ? "Miễn phí" : "Mua gói"}
              </button>
            </form>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#1f2430]">Lịch sử đơn hàng</h2>
          <Link href="/tai-khoan/tin-dang" className="text-sm font-extrabold text-[#c7352d]">Quản lý tin đăng</Link>
        </div>
        <div className="overflow-x-auto rounded-md border border-[#dde1e7] bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-[#f0f2f5] text-xs uppercase tracking-normal text-[#6c7280]">
              <tr>
                <th className="px-4 py-3">Gói</th>
                <th className="px-4 py-3 text-right">Số tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Phương thức</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Hết hạn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0f3]">
              {orders.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-[#6c7280]" colSpan={6}>Chưa có đơn hàng nào.</td>
                </tr>
              ) : null}
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-bold text-[#1f2430]">{order.package.name}</td>
                  <td className="px-4 py-3 text-right font-extrabold">{formatPrice(order.amount)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-[#5f6675]">{order.paymentMethod ?? "-"}</td>
                  <td className="px-4 py-3 text-[#5f6675]">{order.createdAt.toISOString().slice(0, 10)}</td>
                  <td className="px-4 py-3 text-[#5f6675]">{order.expiresAt?.toISOString().slice(0, 10) ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "Chờ thanh toán", className: "border-[#f3d38b] bg-[#fff8e8] text-[#8a5a00]" },
    paid: { label: "Đã thanh toán", className: "border-[#9bd8bd] bg-[#ebfbf3] text-[#16794f]" },
    cancelled: { label: "Đã hủy", className: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]" },
    refunded: { label: "Hoàn tiền", className: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]" },
  };
  const item = map[status] ?? { label: status, className: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]" };

  return <span className={`inline-flex min-h-7 items-center rounded-md border px-2.5 py-1 text-xs font-extrabold ${item.className}`}>{item.label}</span>;
}
