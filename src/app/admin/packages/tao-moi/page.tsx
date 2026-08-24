import { PackageForm } from "@/components/packages/package-form";
import { createPackage } from "@/app/admin/packages/package-actions";

export const dynamic = "force-dynamic";

export default async function NewPackagePage() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Gói & đơn hàng</p>
        <h1 className="mt-1 text-2xl font-extrabold">Tạo gói mới</h1>
      </div>
      <PackageForm action={createPackage} submitLabel="Tạo gói" />
    </section>
  );
}
