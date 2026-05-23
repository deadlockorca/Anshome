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
      <p className="wiki-badge">Wiki subdomain</p>
      <h1 className="wiki-title">Anshome Wiki</h1>
      <p className="wiki-text">
        Route hien tai: <strong>{hasPath ? `/${currentPath}` : "/"}</strong>
      </p>
      <p className="wiki-text">
        Trang nay duoc phuc vu boi route <code>/wiki/[[...slug]]</code> de chay duoc tren host{" "}
        <code>wiki.*</code> khi local.
      </p>

      <div className="wiki-links">
        <Link href="/" className="wiki-link">
          Ve trang chu
        </Link>
        <Link href="/wiki/tai-chinh-bat-dong-san" className="wiki-link">
          Mo thu mot bai wiki
        </Link>
      </div>
    </main>
  );
}
