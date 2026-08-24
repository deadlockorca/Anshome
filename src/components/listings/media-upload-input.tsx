"use client";

import { useRef, useState } from "react";

type MediaUploadInputProps = {
  mimeTypeInputName?: string;
};

export function MediaUploadInput({ mimeTypeInputName = "mimeType" }: MediaUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setStatus("uploading");
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { url?: string; mimeType?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Tải lên thất bại.");
      }

      const urlInput = document.getElementById("listing-media-public-url") as HTMLInputElement | null;
      if (urlInput) {
        urlInput.value = payload.url;
      }

      const mimeInput = document.getElementById(mimeTypeInputName) as HTMLInputElement | null;
      if (mimeInput) {
        mimeInput.value = payload.mimeType ?? file.type;
      }

      setStatus("done");
      setMessage(`Đã tải lên: ${payload.url}`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Tải lên thất bại.");
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="grid gap-1">
      <label className="grid gap-1 text-xs font-bold uppercase text-[#6c7280] md:col-span-2">
        Tải ảnh lên
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={status === "uploading"}
          className="rounded-md border border-[#d5dae2] px-3 py-2 text-sm normal-case text-[#1f2430] file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#1f2430] file:px-3 file:py-1.5 file:text-xs file:font-extrabold file:text-white"
        />
      </label>
      {status === "uploading" ? <p className="text-xs font-bold text-[#6c7280]">Đang tải lên...</p> : null}
      {status === "done" ? <p className="text-xs font-bold text-[#16794f]">{message}</p> : null}
      {status === "error" ? <p className="text-xs font-bold text-[#c7352d]">{message}</p> : null}
    </div>
  );
}
