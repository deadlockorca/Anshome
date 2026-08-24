import Link from "next/link";

const wikiNavItems = [
  { label: "Wiki BĐS", href: "/wiki", slug: undefined },
  { label: "Mua BĐS", href: "/wiki/mua-bat-dong-san", slug: "mua-bat-dong-san" },
  { label: "Bán BĐS", href: "/wiki/ban-bat-dong-san", slug: "ban-bat-dong-san" },
  { label: "Thuê BĐS", href: "/wiki/thue-bat-dong-san", slug: "thue-bat-dong-san" },
  { label: "Tài chính BĐS", href: "/wiki/tai-chinh-bat-dong-san", slug: "tai-chinh-bat-dong-san" },
  { label: "Quy hoạch - Pháp lý", href: "/wiki/quy-hoach-phap-ly", slug: "quy-hoach-phap-ly" },
  { label: "Nội - Ngoại thất", href: "/wiki/noi-ngoai-that", slug: "noi-ngoai-that" },
  { label: "Phong tục", href: "/wiki/phong-tuc", slug: "phong-tuc" },
] as const;

type WikiSubnavProps = {
  activeSlug?: string;
};

export function WikiSubnav({ activeSlug }: WikiSubnavProps) {
  return (
    <nav aria-label="Chuyên mục Wiki BĐS" className="bg-[#1d2023] text-white">
      <div className="mx-auto w-full max-w-[1720px] overflow-x-auto px-4 sm:px-6">
        <div className="flex min-w-max items-center gap-8 sm:gap-10">
          {wikiNavItems.map((item) => {
            const isActive = item.slug === activeSlug;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex h-16 items-center whitespace-nowrap text-[16px] font-extrabold transition-colors sm:text-[17px] ${
                  isActive
                    ? "text-white after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-[#e43d35]"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
