import { createListingLead } from "@/app/tin-dang/lead-actions";

type LeadFormProps = {
  listingId: string;
  leadSent?: boolean;
};

export function LeadForm({ listingId, leadSent = false }: LeadFormProps) {
  return (
    <section className="rounded-md border border-[#dde1e7] bg-white p-4 shadow-[0_14px_40px_rgba(20,28,45,0.05)]">
      <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">Liên hệ người đăng</p>
      <h2 className="mt-1 text-xl font-extrabold">Gửi yêu cầu tư vấn</h2>
      {leadSent ? <p className="mt-3 rounded-md border border-[#9bd8bd] bg-[#ebfbf3] px-3 py-2 text-sm font-bold text-[#16794f]">Đã gửi thông tin liên hệ.</p> : null}
      <form action={createListingLead} className="mt-4 grid gap-3">
        <input type="hidden" name="listingId" value={listingId} />
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Họ tên
          <input name="name" required className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Số điện thoại
          <input name="phone" inputMode="tel" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Email
          <input name="email" type="email" className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430]" />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280]">
          Lời nhắn
          <textarea name="message" rows={4} className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm leading-6 normal-case text-[#1f2430]" />
        </label>
        <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-3 text-sm font-extrabold text-white">
          Gửi liên hệ
        </button>
      </form>
    </section>
  );
}
