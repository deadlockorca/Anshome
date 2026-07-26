import Link from "next/link";

export type SpotlightArticle = {
  title: string;
  href: string;
  image: string;
  published: string;
};

export type SpotlightListItem = {
  title: string;
  href: string;
};

export type SpotlightSection = {
  label: string;
  moreHref: string;
  featured: SpotlightArticle;
  items: SpotlightListItem[];
};

type SpotlightNewsProps = {
  sections: SpotlightSection[];
};

function ClockIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.9" />
      <path d="M12 7.5V12L15.6 14.3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SpotlightNews({ sections }: SpotlightNewsProps) {
  const activeSection = sections[0];

  if (!activeSection) {
    return null;
  }

  return (
    <section className="spotlight-zone" aria-labelledby="spotlight-title">
      <div className="stage-shell spotlight-shell">
        <div className="spotlight-head">
          <h2 id="spotlight-title" className="spotlight-heading">Tin tức bất động sản</h2>
          <Link href={activeSection.moreHref} className="spotlight-more">
            Xem thêm <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="spotlight-grid">
          <article className="spotlight-featured">
            <Link href={activeSection.featured.href} className="spotlight-image-link">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeSection.featured.image} alt={activeSection.featured.title} className="spotlight-image" loading="lazy" />
            </Link>
            <Link href={activeSection.featured.href} className="spotlight-title">
              {activeSection.featured.title}
            </Link>
            <p className="spotlight-meta">
              <ClockIcon />
              <span>{activeSection.featured.published}</span>
            </p>
          </article>

          <div className="spotlight-list-wrap">
            <ul className="spotlight-list">
              {activeSection.items.map((item) => (
                <li key={item.title} className="spotlight-item">
                  <Link href={item.href} className="spotlight-item-link">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
