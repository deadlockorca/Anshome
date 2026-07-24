"use client";

import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export function MobileStickySearch() {
  const router = useRouter();

  useEffect(() => {
    const compactClass = "mobile-header-compact";

    function updateCompactHeader() {
      document.body.classList.toggle(compactClass, window.scrollY > 120);
    }

    updateCompactHeader();
    window.addEventListener("scroll", updateCompactHeader, { passive: true });

    return () => {
      document.body.classList.remove(compactClass);
      window.removeEventListener("scroll", updateCompactHeader);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const keyword = formData.get("q")?.toString().trim();
    const params = new URLSearchParams();

    if (keyword) {
      params.set("q", keyword);
    }

    params.set("transactionType", "rent");
    router.push(`/tin-dang?${params.toString()}`);
  }

  return (
    <form className="mobile-sticky-search" aria-label="Tìm kiếm nhanh" onSubmit={handleSubmit}>
      <input name="q" type="text" className="mobile-sticky-search-input" placeholder="Thuê chung cư 2 ngủ" />
      <button type="submit" className="mobile-sticky-search-button" aria-label="Tìm kiếm">
        <SearchIcon />
      </button>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.8" stroke="currentColor" strokeWidth="1.9" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
