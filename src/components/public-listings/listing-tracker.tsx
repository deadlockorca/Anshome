"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { recordListingView, recordPhoneReveal } from "@/app/tin-dang/tracking-actions";

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ListingViewTracker({ listingId }: { listingId: string }) {
  const sessionIdRef = useRef<string | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) {
      return;
    }
    firedRef.current = true;
    sessionIdRef.current = createSessionId();

    const formData = new FormData();
    formData.set("listingId", listingId);
    formData.set("sessionId", sessionIdRef.current);
    void recordListingView(formData);
  }, [listingId]);

  return null;
}

export function PhoneRevealButton({
  listingId,
  phone,
  className,
  icon,
  label = "Hiện số",
}: {
  listingId: string;
  phone: string;
  className?: string;
  icon?: ReactNode;
  label?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  function handleReveal() {
    if (revealed) {
      return;
    }

    setRevealed(true);

    if (!sessionIdRef.current) {
      sessionIdRef.current = createSessionId();
    }

    const formData = new FormData();
    formData.set("listingId", listingId);
    formData.set("sessionId", sessionIdRef.current);
    void recordPhoneReveal(formData);
  }

  const formatted = revealed ? phone : maskPhone(phone);

  if (revealed) {
    return (
      <a href={`tel:${phone}`} className={className}>
        {icon}
        <span>{formatted} · {label}</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={handleReveal} className={className}>
      {icon}
      <span>{formatted} · {label}</span>
    </button>
  );
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length >= 7) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ***`;
  }

  return phone;
}
