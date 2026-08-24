"use client";

import { useActionState } from "react";
import type { DirectoryLeadState } from "@/app/danh-ba/directory-actions";

type Props = {
  action: (prevState: DirectoryLeadState, formData: FormData) => Promise<DirectoryLeadState>;
  submitLabel?: string;
};

export function DirectoryContactForm({ action, submitLabel = "Gửi yêu cầu tư vấn" }: Props) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="mt-4 grid gap-3" key={state?.status === "success" ? "ok" : "form"}>
      <input name="name" required minLength={2} placeholder="Họ và tên" className="rounded-md border border-[#d7dbe3] px-3 py-2 text-sm font-bold outline-none focus:border-[#c7352d]" />
      <input name="phone" required pattern="[0-9+()\s-]{9,15}" placeholder="Số điện thoại" className="rounded-md border border-[#d7dbe3] px-3 py-2 text-sm font-bold outline-none focus:border-[#c7352d]" />
      <textarea name="message" rows={3} placeholder="Nội dung cần tư vấn (tùy chọn)" className="rounded-md border border-[#d7dbe3] px-3 py-2 text-sm font-bold outline-none focus:border-[#c7352d]" />
      <button type="submit" className="rounded-md bg-[#c7352d] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#a92a23]">{submitLabel}</button>
      {state?.status === "success" ? <p className="rounded-md bg-[#e8f6ee] px-3 py-2 text-[13px] font-bold text-[#0d7a3f]">{state.message}</p> : null}
      {state?.status === "error" ? <p className="rounded-md bg-[#fdecec] px-3 py-2 text-[13px] font-bold text-[#b42318]">{state.message}</p> : null}
    </form>
  );
}