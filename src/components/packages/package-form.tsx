import type { ListingPackage } from "@/generated/prisma/client";

type PackageFormProps = {
  action: (formData: FormData) => Promise<void>;
  pkg?: ListingPackage;
  submitLabel: string;
};

export function PackageForm({ action, pkg, submitLabel }: PackageFormProps) {
  return (
    <form action={action} className="grid max-w-2xl gap-4 rounded-md border border-[#dde1e7] bg-white p-4">
      {pkg ? <input type="hidden" name="id" value={pkg.id} /> : null}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Mã gói (code)
          <input name="code" required defaultValue={pkg?.code ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Tên gói
          <input name="name" required defaultValue={pkg?.name ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
      </div>

      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
        Mô tả
        <textarea name="description" rows={2} defaultValue={pkg?.description ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm leading-6 normal-case text-[#1f2430]" />
      </label>

      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Giá (VND)
          <input name="price" type="number" step="0.01" min="0" required defaultValue={pkg?.price.toString() ?? "0"} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Hiệu lực (ngày)
          <input name="durationDays" type="number" min="1" required defaultValue={pkg?.durationDays ?? 30} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Giới hạn tin (0 = không giới hạn)
          <input name="maxListings" type="number" min="0" defaultValue={pkg?.maxListings ?? 0} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Thứ tự hiển thị
          <input name="sortOrder" type="number" defaultValue={pkg?.sortOrder ?? 0} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Quota nổi bật
          <input name="featuredQuota" type="number" min="0" defaultValue={pkg?.featuredQuota ?? 0} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Quota đẩy tin
          <input name="boostQuota" type="number" min="0" defaultValue={pkg?.boostQuota ?? 0} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Quota làm mới
          <input name="refreshQuota" type="number" min="0" defaultValue={pkg?.refreshQuota ?? 0} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-bold text-[#384052]">
        <input name="isActive" type="checkbox" defaultChecked={pkg?.isActive ?? true} className="h-4 w-4" />
        Đang bán (hiển thị trên trang gói đăng tin)
      </label>

      <div>
        <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
