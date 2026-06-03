import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { SellerLoginForm } from "@/components/auth/seller-login-form";
import "./seller-login.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đăng nhập người bán | Anshome",
  description: "Đăng nhập tài khoản người bán để đăng tin và quản lý hiệu quả bất động sản trên Anshome.",
};

export default async function SellerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnurl?: string }>;
}) {
  const [{ returnurl }, currentSession] = await Promise.all([searchParams, getCurrentSession()]);
  const returnUrl = normalizeReturnUrl(returnurl);

  if (currentSession) {
    redirect(returnUrl);
  }

  return (
    <main className="seller-login-page">
      <section className="seller-login-shell" aria-labelledby="seller-login-title">
        <div className="seller-login-visual">
          <Link href="/" className="seller-login-brand">
            <MiniLogo />
            <span>
              Anshome
              <small>Trung tâm người bán</small>
            </span>
          </Link>

          <div className="seller-illustration" aria-hidden>
            <div className="seller-lamp" />
            <div className="seller-sofa"><span /></div>
            <div className="seller-person" />
            <div className="seller-laptop" />
            <div className="seller-paper seller-paper-one" />
            <div className="seller-paper seller-paper-two" />
          </div>

          <div className="seller-login-copy">
            <h1 id="seller-login-title">Đăng tin bất động sản</h1>
            <p>Quản lý tin đăng, ảnh, trạng thái duyệt và khách hàng quan tâm trong một không gian riêng.</p>
          </div>
        </div>

        <aside className="seller-login-card">
          <Link href="/" className="seller-login-close" aria-label="Về trang chủ">×</Link>
          <p className="seller-card-eyebrow">Xin chào bạn</p>
          <h2>Đăng nhập để tiếp tục</h2>
          <SellerLoginForm returnUrl={returnUrl} />
          <div className="seller-form-row">
            <label>
              <input type="checkbox" /> Nhớ tài khoản
            </label>
            <button type="button">Quên mật khẩu?</button>
          </div>
          <div className="seller-or">
            <span />
            <p>Hoặc</p>
            <span />
          </div>
          <div className="seller-socials">
            <button type="button"><span>●</span> Đăng nhập với Apple</button>
            <button type="button"><span className="seller-google">G</span> Đăng nhập với Google</button>
          </div>
          <p className="seller-register-note">
            Chưa có tài khoản? <Link href="/dang-nhap?mode=register&next=/tai-khoan/tin-dang/tao-moi">Đăng ký tại đây</Link>
          </p>
          <Link href="/tin-dang" className="seller-browse-link">Xem tin đăng đang hiển thị</Link>
        </aside>
      </section>
    </main>
  );
}

function normalizeReturnUrl(value: string | undefined): string {
  const fallback = "/tai-khoan/tin-dang/tao-moi";

  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

function MiniLogo() {
  return (
    <svg viewBox="0 0 44 36" width="44" height="36" aria-hidden>
      <path d="M4 21 22 5l18 16-5 5-13-11L9 26 4 21Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M9 29 22 18l13 11-5 5-8-7-8 7-5-5Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}
