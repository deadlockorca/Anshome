import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PackageForm } from "@/components/packages/package-form";
import { updatePackage } from "@/app/admin/packages/package-actions";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await db.listingPackage.findUnique({ where: { id } });

  if (!pkg) {
    notFound();
  }

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Gói & đơn hàng</p>
        <h1 className="mt-1 text-2xl font-extrabold">Sửa gói: {pkg.name}</h1>
      </div>
      <PackageForm action={updatePackage} pkg={pkg} submitLabel="Lưu gói" />
    </section>
  );
}
