"use client";

import { useEffect, useRef, useState } from "react";
import { toggleFavorite } from "@/app/tai-khoan/yeu-thich/favorite-actions";

export function FavoriteButton({
  listingId,
  initialActive = false,
  className,
  iconClassName,
}: {
  listingId: string;
  initialActive?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  const [active, setActive] = useState(initialActive);
  const [busy, setBusy] = useState(false);
  const redirectPathRef = useRef("/tai-khoan/yeu-thich");

  useEffect(() => {
    redirectPathRef.current = `${window.location.pathname}${window.location.search}`;
  }, []);

  async function handleToggle() {
    if (busy) {
      return;
    }

    setBusy(true);

    const formData = new FormData();
    formData.set("listingId", listingId);
    formData.set("redirectPath", redirectPathRef.current);

    try {
      await toggleFavorite(formData);
      setActive((current) => !current);
    } catch {
      setActive((current) => !current);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={active ? "Bỏ lưu tin" : "Lưu tin"}
      title={active ? "Bỏ lưu tin" : "Lưu tin"}
      disabled={busy}
      className={className}
    >
      <HeartIcon active={active} className={iconClassName} />
    </button>
  );
}

function HeartIcon({ active, className }: { active: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      className={className}
    >
      <path
        d="M20.2 4.9C18.2 2.9 15 2.9 13 4.9L12 5.9L11 4.9C9 2.9 5.8 2.9 3.8 4.9C1.7 6.9 1.7 10.2 3.8 12.2L12 20.4L20.2 12.2C22.3 10.2 22.3 6.9 20.2 4.9Z"
        stroke="currentColor"
        strokeWidth="1.9"
      />
    </svg>
  );
}
