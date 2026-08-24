import Link from "next/link";

const footerContacts = [
  {
    label: "Hotline",
    value: "(+84) 901 827 555",
    href: "tel:+84901827555",
    icon: "phone",
  },
  {
    label: "Hỗ trợ khách hàng",
    value: "trogiup.anshome.vn",
    href: "/ho-tro",
    icon: "support",
  },
  {
    label: "Chăm sóc khách hàng",
    value: "hotro@anshome.vn",
    href: "mailto:hotro@anshome.vn",
    icon: "mailbox",
  },
] as const;
const footerGuideLinks = [
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
  { label: "Báo giá và hỗ trợ", href: "/bao-gia" },
  { label: "Câu hỏi thường gặp", href: "/cau-hoi-thuong-gap" },
  { label: "Góp ý báo lỗi", href: "/gop-y-bao-loi" },
  { label: "Sitemap", href: "/trang-sitemap" },
];
const footerPolicyLinks = [
  { label: "Quy định đăng tin", href: "/quy-dinh-dang-tin" },
  { label: "Quy chế hoạt động", href: "/quy-che-hoat-dong" },
  { label: "Điều khoản thỏa thuận", href: "/dieu-khoan-thoa-thuan" },
  { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
  { label: "Giải quyết khiếu nại", href: "/giai-quyet-khieu-nai" },
];

export function LogoMark() {
  return (
    <svg
      aria-hidden
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-mark"
    >
      <path d="M8 24L23 10L38 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 21V38H34V21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 38V29H26V38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FooterIcon({ icon }: { icon: "phone" | "support" | "mailbox" | "pin" }) {
  if (icon === "phone") {
    return (
      <svg aria-hidden width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.2 4.4L9.1 8.5L6.9 10.1C8 12.6 10 14.6 12.5 15.8L14.2 13.6L18.2 15.5L17.6 18.8C17.5 19.6 16.8 20.2 16 20.2C9.2 20.2 3.8 14.8 3.8 8C3.8 7.2 4.4 6.5 5.2 6.4L7.2 4.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.2 4.4C16.8 4.8 18.8 6.8 19.2 9.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M14.2 7.4C15.2 7.7 15.9 8.4 16.2 9.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "support") {
    return (
      <svg aria-hidden width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3.8 19.6C4.4 16.5 6.3 14.8 9 14.8C10.3 14.8 11.4 15.2 12.3 15.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M15.5 6.3C16.1 5.5 17 5 18.1 5C19.9 5 21.2 6.2 21.2 7.9C21.2 9.5 20.1 10.2 18.9 10.7V12.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.9 15.7V15.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "mailbox") {
    return (
      <svg aria-hidden width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.2 19V9.4C4.2 7.4 5.8 5.8 7.8 5.8H15.8C17.8 5.8 19.4 7.4 19.4 9.4V19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.2 10.2H19.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M8.7 5.8V19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M15.4 13.2H22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21S5.7 15.6 5.7 10.3C5.7 6.7 8.5 3.9 12 3.9C15.5 3.9 18.3 6.7 18.3 10.3C18.3 15.6 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="10.3" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.7 3.7L10.3 14.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20.7 3.7L14.1 20.3L10.3 14.1L3.7 10.3L20.7 3.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 12H20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C14.2 5.4 15.4 8.4 15.4 12C15.4 15.6 14.2 18.6 12 21C9.8 18.6 8.6 15.6 8.6 12C8.6 8.4 9.8 5.4 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronSelectIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="stage-shell site-footer-shell">
        <div className="footer-top">
          <Link href="/" className="footer-brand" aria-label="Anshome">
            <LogoMark />
            <div className="footer-brand-text">
              <p className="footer-brand-main">Anshome</p>
              <p className="footer-brand-sub">nền tảng bất động sản</p>
            </div>
          </Link>

          <div className="footer-contact-strip" aria-label="Thông tin liên hệ nhanh">
            {footerContacts.map((contact) => (
              <Link key={contact.label} href={contact.href} className="footer-contact-card">
                <FooterIcon icon={contact.icon} />
                <span>
                  <span className="footer-contact-label">{contact.label}</span>
                  <strong>{contact.value}</strong>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-company">
            <h2>Công ty cổ phần Anshome Việt Nam</h2>
            <ul className="footer-company-list">
              <li>
                <FooterIcon icon="pin" />
                <span>Tầng 31, Keangnam Hanoi Landmark Tower, Phường Yên Hòa, Thành phố Hà Nội, Việt Nam</span>
              </li>
              <li>
                <FooterIcon icon="phone" />
                <a href="tel:+84901827555">(+84) 901 827 555</a>
              </li>
            </ul>

          </div>

          <FooterLinkColumn title="Hướng dẫn" links={footerGuideLinks} />
          <FooterLinkColumn title="Quy định" links={footerPolicyLinks} />

          <div className="footer-actions">
            <section aria-labelledby="footer-newsletter-title">
              <h2 id="footer-newsletter-title">Đăng ký nhận tin</h2>
              <form className="footer-newsletter">
                <label className="sr-only" htmlFor="footer-email">
                  Email nhận tin
                </label>
                <input id="footer-email" type="email" placeholder="Nhập email của bạn" />
                <button type="submit" aria-label="Đăng ký nhận tin">
                  <SendIcon />
                </button>
              </form>
            </section>

            <section aria-labelledby="footer-locale-title">
              <h2 id="footer-locale-title">Quốc gia &amp; ngôn ngữ</h2>
              <button type="button" className="footer-locale-select">
                <GlobeIcon />
                <span>Việt Nam</span>
                <ChevronSelectIcon />
              </button>
            </section>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <nav className="footer-link-column" aria-label={title}>
      <h2>
        <span>{title}</span>
        <svg aria-hidden viewBox="0 0 24 24" className="footer-link-column-chevron">
          <path d="M9 5L16 12L9 19" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
