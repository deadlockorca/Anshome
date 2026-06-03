import type { CategoryTransactionType, Listing, ListingAttribute, Location } from "@/generated/prisma/client";

type CategoryOption = {
  id: string;
  name: string;
  transactionType: CategoryTransactionType;
};

type LocationOption = Pick<Location, "id" | "fullName" | "type">;

type ListingWithAttributes = Listing & {
  attributes: ListingAttribute | null;
};

type ListingFormProps = {
  action: (formData: FormData) => Promise<void>;
  categories: CategoryOption[];
  locations: LocationOption[];
  listing?: ListingWithAttributes;
  submitLabel: string;
};

const directions = ["Đông", "Tây", "Nam", "Bắc", "Đông Bắc", "Đông Nam", "Tây Bắc", "Tây Nam"];
const legalStatuses = ["Sổ đỏ/Sổ hồng", "Hợp đồng mua bán", "Đang chờ sổ", "Giấy tay", "Pháp lý khác"];
const interiorStatuses = ["Cơ bản", "Đầy đủ", "Cao cấp", "Bàn giao thô"];

const transactionTypeLabel: Record<CategoryTransactionType, string> = {
  sale: "Bán",
  rent: "Cho thuê",
  both: "Cả bán và cho thuê",
};

function decimalValue(value: unknown): string {
  return value == null ? "" : String(value);
}

function locationsByType(locations: LocationOption[], type: LocationOption["type"]) {
  return locations.filter((location) => location.type === type);
}

export function ListingForm({ action, categories, locations, listing, submitLabel }: ListingFormProps) {
  const attributes = listing?.attributes;
  const transactionType = listing?.transactionType ?? "sale";
  const provinceOptions = locationsByType(locations, "province");
  const districtOptions = locationsByType(locations, "district");
  const wardOptions = locationsByType(locations, "ward");
  const streetOptions = locationsByType(locations, "street");

  return (
    <form action={action} className="grid gap-4 rounded-md border border-[#dde1e7] bg-white p-4">
      {listing ? <input type="hidden" name="id" value={listing.id} /> : null}
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Giao dịch
          <select name="transactionType" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue={transactionType}>
            <option value="sale">Bán</option>
            <option value="rent">Cho thuê</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280] md:col-span-2">
          Danh mục
          <select name="categoryId" required className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue={listing?.categoryId ?? ""}>
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({transactionTypeLabel[category.transactionType]})
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
        Tiêu đề
        <input name="title" required defaultValue={listing?.title ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
      </label>

      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
        Mô tả
        <textarea name="description" required rows={7} defaultValue={listing?.description ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm leading-6 normal-case text-[#1f2430]" />
      </label>

      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Giá
          <input name="price" inputMode="decimal" defaultValue={decimalValue(listing?.price)} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Đơn vị giá
          <input name="priceUnit" defaultValue={listing?.priceUnit ?? "VND"} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Diện tích m2
          <input name="area" inputMode="decimal" defaultValue={decimalValue(listing?.area)} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Diện tích sử dụng
          <input name="usableArea" inputMode="decimal" defaultValue={decimalValue(attributes?.usableArea)} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <LocationSelect label="Tỉnh/thành" name="provinceId" options={provinceOptions} value={listing?.provinceId} />
        <LocationSelect label="Quận/huyện" name="districtId" options={districtOptions} value={listing?.districtId} />
        <LocationSelect label="Phường/xã" name="wardId" options={wardOptions} value={listing?.wardId} />
        <LocationSelect label="Đường/phố" name="streetId" options={streetOptions} value={listing?.streetId} />
      </div>

      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
        Địa chỉ hiển thị
        <input name="addressText" defaultValue={listing?.addressText ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Phòng ngủ
          <input name="bedrooms" type="number" min={0} defaultValue={attributes?.bedrooms ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Phòng tắm
          <input name="bathrooms" type="number" min={0} defaultValue={attributes?.bathrooms ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Số tầng
          <input name="floors" type="number" min={0} defaultValue={attributes?.floors ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Mặt tiền
          <input name="frontageWidth" inputMode="decimal" defaultValue={decimalValue(attributes?.frontageWidth)} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Độ rộng đường
          <input name="roadWidth" inputMode="decimal" defaultValue={decimalValue(attributes?.roadWidth)} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Diện tích đất
          <input name="landArea" inputMode="decimal" defaultValue={decimalValue(attributes?.landArea)} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <OptionSelect label="Hướng nhà" name="direction" options={directions} value={attributes?.direction} />
        <OptionSelect label="Pháp lý" name="legalStatus" options={legalStatuses} value={attributes?.legalStatus} />
        <OptionSelect label="Nội thất" name="interiorStatus" options={interiorStatuses} value={attributes?.interiorStatus} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Tên liên hệ
          <input name="contactName" required defaultValue={listing?.contactName ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Số điện thoại liên hệ
          <input name="contactPhone" required defaultValue={listing?.contactPhone ?? ""} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
      </div>

      <div>
        <button className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function LocationSelect({ label, name, options, value }: { label: string; name: string; options: LocationOption[]; value?: string | null }) {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
      {label}
      <select name={name} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue={value ?? ""}>
        <option value="">Chưa chọn</option>
        {options.map((location) => (
          <option key={location.id} value={location.id}>
            {location.fullName}
          </option>
        ))}
      </select>
    </label>
  );
}

function OptionSelect({ label, name, options, value }: { label: string; name: string; options: string[]; value?: string | null }) {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
      {label}
      <select name={name} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]" defaultValue={value ?? ""}>
        <option value="">Chưa chọn</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
