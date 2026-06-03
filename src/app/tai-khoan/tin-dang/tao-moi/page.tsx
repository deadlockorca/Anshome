import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentSession, hasRole } from "@/lib/auth/session";
import { listingPosterRoleCodes } from "@/lib/auth/roles";
import { ListingForm } from "@/components/listings/listing-form";
import { createDraftListing } from "@/app/tai-khoan/tin-dang/listing-actions";

export const dynamic = "force-dynamic";

export default async function CreateListingPage() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    redirect("/dang-nhap");
  }

  if (!hasRole(currentSession, listingPosterRoleCodes)) {
    redirect("/khong-co-quyen");
  }

  const [categories, locations] = await Promise.all([
    db.category.findMany({
      where: { isActive: true },
      orderBy: [{ transactionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        transactionType: true,
      },
    }),
    db.location.findMany({
      where: { isActive: true },
      orderBy: [{ type: "asc" }, { fullName: "asc" }],
      select: {
        id: true,
        fullName: true,
        type: true,
      },
    }),
  ]);

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Bản nháp tin đăng</p>
        <h1 className="mt-1 text-2xl font-extrabold">Tạo tin đăng mới</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6675]">
          Tin mới sẽ được lưu ở trạng thái bản nháp. Sau khi kiểm tra nội dung, gửi sang hàng chờ để quản trị viên duyệt.
        </p>
      </div>
      <ListingForm action={createDraftListing} categories={categories} locations={locations} submitLabel="Lưu bản nháp" />
    </section>
  );
}
