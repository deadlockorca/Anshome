import Link from "next/link";

type WikiPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function WikiPage({ params }: WikiPageProps) {
  const { slug = [] } = await params;
  const hasPath = slug.length > 0;
  const currentPath = hasPath ? slug.join("/") : "";

  return (
    <main className="wiki-shell">
      <p className="wiki-badge">Không gian wiki</p>
      <h1 className="wiki-title">Anshome Wiki</h1>
      <p className="wiki-text">
        Đường dẫn hiện tại: <strong>{hasPath ? `/${currentPath}` : "/"}</strong>
      </p>
      <p className="wiki-text">
        Trang này được phục vụ bởi route <code>/wiki/[[...slug]]</code> để chạy được trên host{" "}
        <code>wiki.*</code> khi chạy cục bộ.
      </p>

      <div className="wiki-links">
        <Link href="/" className="wiki-link">
          Về trang chủ
        </Link>
        <Link href="/wiki/tai-chinh-bat-dong-san" className="wiki-link">
          Mở thử một bài wiki
        </Link>
      </div>
    </main>
  );
}
