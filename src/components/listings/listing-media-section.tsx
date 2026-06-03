import { addListingMedia, removeListingMedia, updateListingMedia } from "@/app/tai-khoan/tin-dang/listing-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ListingMedia, Media } from "@/generated/prisma/client";

export type ListingMediaWithMedia = ListingMedia & {
  media: Media;
};

type ListingMediaSectionProps = {
  listingId: string;
  canEdit: boolean;
  media: ListingMediaWithMedia[];
};

const mediaTypeOptions = ["image", "video", "floor_plan", "document"];

const mediaTypeLabel: Record<string, string> = {
  image: "Hình ảnh",
  video: "Video",
  floor_plan: "Mặt bằng",
  document: "Tài liệu",
};

export function ListingMediaSection({ listingId, canEdit, media }: ListingMediaSectionProps) {
  return (
    <section className="rounded-md border border-[#dde1e7] bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Tệp đính kèm</p>
          <h2 className="mt-1 text-base font-extrabold">Ảnh và tài liệu tin đăng</h2>
        </div>
        <p className="text-sm font-bold text-[#384052]">{media.length} mục</p>
      </div>

      {canEdit ? (
        <form action={addListingMedia} className="mt-4 grid gap-3 rounded-md border border-[#edf0f3] bg-[#fafbfc] p-3 md:grid-cols-4">
          <input type="hidden" name="listingId" value={listingId} />
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280] md:col-span-2">
            URL tệp
            <input name="publicUrl" required placeholder="https://..." className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <MediaTypeSelect />
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Thứ tự
            <input name="sortOrder" type="number" defaultValue={media.length} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280] md:col-span-2">
            Chú thích
            <input name="caption" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
            Loại MIME
            <input name="mimeType" placeholder="image/jpeg" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
          </label>
          <div className="flex items-end">
            <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-2 text-sm font-extrabold text-white">
              Thêm tệp
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {media.length === 0 ? <p className="text-sm text-[#6c7280]">Chưa có tệp đính kèm.</p> : null}
        {media.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-md border border-[#edf0f3] bg-white">
            {item.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.media.publicUrl} alt={item.caption ?? "Tệp của tin đăng"} className="aspect-[4/3] w-full bg-[#f0f2f5] object-cover" />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-[#f0f2f5] p-4 text-center text-sm font-bold text-[#384052]">
                <a href={item.media.publicUrl} target="_blank" rel="noreferrer" className="hover:text-[#c7352d]">
                  Mở {mediaTypeLabel[item.type] ?? item.type}
                </a>
              </div>
            )}
            <div className="grid gap-3 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge value={item.moderationStatus} />
                <span className="font-mono text-xs text-[#6c7280]">#{item.sortOrder}</span>
              </div>
              {item.caption ? <p className="text-sm font-bold text-[#1f2430]">{item.caption}</p> : null}
              <p className="break-all text-xs leading-5 text-[#6c7280]">{item.media.publicUrl}</p>

              {canEdit ? (
                <div className="grid gap-2 border-t border-[#edf0f3] pt-3">
                  <form action={updateListingMedia} className="grid gap-2">
                    <input type="hidden" name="listingId" value={listingId} />
                    <input type="hidden" name="listingMediaId" value={item.id} />
                    <input name="publicUrl" defaultValue={item.media.publicUrl} className="rounded-md border border-[#d5dae2] px-3 py-2 text-xs text-[#1f2430]" />
                    <div className="grid grid-cols-2 gap-2">
                      <select name="type" defaultValue={item.type} className="rounded-md border border-[#d5dae2] px-3 py-2 text-xs font-bold text-[#1f2430]">
                        {mediaTypeOptions.map((option) => (
                          <option key={option} value={option}>{mediaTypeLabel[option]}</option>
                        ))}
                      </select>
                      <input name="sortOrder" type="number" defaultValue={item.sortOrder} className="rounded-md border border-[#d5dae2] px-3 py-2 text-xs text-[#1f2430]" />
                    </div>
                    <input name="caption" defaultValue={item.caption ?? ""} placeholder="Chú thích" className="rounded-md border border-[#d5dae2] px-3 py-2 text-xs text-[#1f2430]" />
                    <input name="mimeType" defaultValue={item.media.mimeType} placeholder="Loại MIME" className="rounded-md border border-[#d5dae2] px-3 py-2 text-xs text-[#1f2430]" />
                    <button type="submit" className="rounded-md bg-[#1f2430] px-3 py-2 text-xs font-extrabold text-white">
                      Lưu tệp
                    </button>
                  </form>
                  <form action={removeListingMedia}>
                    <input type="hidden" name="listingId" value={listingId} />
                    <input type="hidden" name="listingMediaId" value={item.id} />
                    <button type="submit" className="w-full rounded-md border border-[#c7352d] px-3 py-2 text-xs font-extrabold text-[#c7352d]">
                      Gỡ bỏ
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MediaTypeSelect() {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
      Loại tệp
      <select name="type" defaultValue="image" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm font-semibold normal-case text-[#1f2430]">
        {mediaTypeOptions.map((option) => (
          <option key={option} value={option}>{mediaTypeLabel[option]}</option>
        ))}
      </select>
    </label>
  );
}
