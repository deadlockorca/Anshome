"use client";

import Link from "next/link";
import { useId, useState } from "react";

type SeoLinkItem = {
  label: string;
  href: string;
  hasMore?: boolean;
};

export type SeoLinkGroupData = {
  title: string;
  links: readonly SeoLinkItem[];
  extraLinks?: readonly SeoLinkItem[];
};

function TinyChevronIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className="seo-link-chevron">
      <path d="M4.5 6.25L8 9.75L11.5 6.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RowChevronIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" className="seo-link-mobile-chevron">
      <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SeoLinkList({ links, id, className }: { links: readonly SeoLinkItem[]; id?: string; className?: string }) {
  return (
    <ul id={id} className={className}>
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href}>
            <span>{link.label}</span>
            {link.hasMore ? <TinyChevronIcon /> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SeoLinkGroupColumn({ group }: { group: SeoLinkGroupData }) {
  const [isOpen, setIsOpen] = useState(false);
  const extraListId = useId();
  const extraLinks = group.extraLinks ?? [];
  const mobileHref = group.links[0]?.href ?? "/trang-sitemap";

  return (
    <section className="seo-link-group">
      <Link href={mobileHref} className="seo-link-mobile-row">
        <span>{group.title}</span>
        <RowChevronIcon />
      </Link>
      <h2>{group.title}</h2>
      <SeoLinkList links={group.links} />
      {extraLinks.length > 0 ? (
        <>
          {isOpen ? <SeoLinkList id={extraListId} links={extraLinks} className="seo-link-extra-list" /> : null}
          <button type="button" className="seo-link-more-button" aria-expanded={isOpen} aria-controls={extraListId} onClick={() => setIsOpen((current) => !current)}>
            {isOpen ? "Thu gọn" : "Xem thêm"}
          </button>
        </>
      ) : null}
    </section>
  );
}
