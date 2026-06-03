"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type AuthMode = "login" | "register";

type LoginResponse = {
  user?: {
    roles?: Array<{ code: string }>;
  };
  error?: string;
};

type RegisterResponse = {
  error?: string;
};

type PublicAuthPanelProps = {
  mode: AuthMode;
  nextPath?: string;
  onModeChange: (mode: AuthMode) => void;
  onClose?: () => void;
};

const adminRoles = new Set(["moderator", "editor", "ops", "super_admin"]);

export function PublicAuthPanel({ mode, nextPath, onModeChange, onClose }: PublicAuthPanelProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState("owner");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchMode(nextMode: AuthMode) {
    setError(null);
    setIsSubmitting(false);
    onModeChange(nextMode);
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password: loginPassword }),
    });
    const body = (await response.json().catch(() => null)) as LoginResponse | null;

    if (!response.ok) {
      setError(body?.error ?? "Đăng nhập không thành công.");
      setIsSubmitting(false);
      return;
    }

    const roleCodes = body?.user?.roles?.map((role) => role.code) ?? [];
    onClose?.();
    router.push(resolveLoginTarget(nextPath, roleCodes));
    router.refresh();
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Cần đồng ý điều khoản trước khi đăng ký.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName,
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword,
        role: registerRole,
      }),
    });
    const body = (await response.json().catch(() => null)) as RegisterResponse | null;

    if (!response.ok) {
      setError(body?.error ?? "Đăng ký không thành công.");
      setIsSubmitting(false);
      return;
    }

    onClose?.();
    router.push(safeNextPath(nextPath) ?? (registerRole === "seeker" ? "/tin-dang" : "/tai-khoan/tin-dang"));
    router.refresh();
  }

  return (
    <div className={`auth-modal-panel ${mode === "register" ? "auth-modal-panel-register" : ""}`}>
      <aside className="auth-modal-visual" aria-hidden>
        <div className="auth-modal-brand">
          <span className="auth-modal-logo">
            <MiniLogo />
          </span>
          <div>
            <p>Anshome</p>
            <span>nền tảng bất động sản</span>
          </div>
        </div>
        <div className="auth-illustration">
          <div className="auth-lamp" />
          <div className="auth-sofa">
            <span />
          </div>
          <div className="auth-person" />
          <div className="auth-laptop" />
        </div>
        <div className="auth-modal-copy">
          <p>Tìm nhà đất</p>
          <strong>Anshome dẫn lối</strong>
        </div>
      </aside>

      <section className="auth-modal-content">
        {onClose ? (
          <button type="button" className="auth-close" aria-label="Đóng" onClick={onClose}>
            ×
          </button>
        ) : null}

        {mode === "login" ? (
          <>
            <p className="auth-eyebrow">Xin chào bạn</p>
            <h2 id="auth-modal-title">Đăng nhập để tiếp tục</h2>
            <form onSubmit={handleLogin} className="auth-form">
              <label className="auth-field">
                <span className="auth-field-icon">⌾</span>
                <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="SĐT chính hoặc email" autoComplete="username" required />
              </label>
              <label className="auth-field">
                <span className="auth-field-icon">▣</span>
                <input value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} placeholder="Mật khẩu" type="password" autoComplete="current-password" minLength={8} required />
              </label>
              {error ? <p className="auth-error">{error}</p> : null}
              <button type="submit" className="auth-primary" disabled={isSubmitting}>
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>
            <div className="auth-row">
              <label className="auth-checkbox">
                <input type="checkbox" /> Nhớ tài khoản
              </label>
              <button type="button" className="auth-text-button">Quên mật khẩu?</button>
            </div>
            <AuthDivider />
            <SocialButtons actionLabel="Đăng nhập" />
            <p className="auth-switch">
              Chưa là thành viên?{" "}
              <button type="button" onClick={() => switchMode("register")}>
                Đăng ký
              </button>{" "}
              tại đây
            </p>
          </>
        ) : (
          <>
            <p className="auth-eyebrow">Xin chào bạn</p>
            <h2 id="auth-modal-title">Đăng ký tài khoản mới</h2>
            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-register-grid">
                <label className="auth-field">
                  <span className="auth-field-icon">☏</span>
                  <input value={registerPhone} onChange={(event) => setRegisterPhone(event.target.value)} placeholder="Nhập số điện thoại" autoComplete="tel" />
                </label>
                <label className="auth-field">
                  <span className="auth-field-icon">@</span>
                  <input value={registerEmail} onChange={(event) => setRegisterEmail(event.target.value)} placeholder="Email" type="email" autoComplete="email" />
                </label>
                <label className="auth-field">
                  <span className="auth-field-icon">◇</span>
                  <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Tên hiển thị" autoComplete="name" required />
                </label>
                <label className="auth-field">
                  <span className="auth-field-icon">▣</span>
                  <input value={registerPassword} onChange={(event) => setRegisterPassword(event.target.value)} placeholder="Mật khẩu tối thiểu 8 ký tự" type="password" autoComplete="new-password" minLength={8} required />
                </label>
              </div>
              <label className="auth-select">
                <span>Loại tài khoản</span>
                <select value={registerRole} onChange={(event) => setRegisterRole(event.target.value)}>
                  <option value="owner">Chủ nhà / đăng tin</option>
                  <option value="agent">Môi giới</option>
                  <option value="seeker">Người tìm nhà</option>
                </select>
              </label>
              <label className="auth-terms">
                <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
                <span>
                  Tôi đã đọc và đồng ý với <strong>Điều khoản sử dụng</strong>, <strong>Chính sách bảo mật</strong>, <strong>Quy chế</strong> của Anshome.
                </span>
              </label>
              {error ? <p className="auth-error">{error}</p> : null}
              <button type="submit" className="auth-primary" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo tài khoản..." : "Tiếp tục"}
              </button>
            </form>
            <AuthDivider />
            <SocialButtons actionLabel="Đăng nhập" />
            <p className="auth-switch">
              Bạn đã có tài khoản?{" "}
              <button type="button" onClick={() => switchMode("login")}>
                Đăng nhập
              </button>{" "}
              tại đây
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function resolveLoginTarget(nextPath: string | undefined, roleCodes: string[]): string {
  const safeNext = safeNextPath(nextPath);

  if (safeNext) {
    return safeNext;
  }

  return roleCodes.some((role) => adminRoles.has(role)) ? "/admin" : "/tai-khoan/tin-dang";
}

function safeNextPath(path: string | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return null;
  }

  return path;
}

function AuthDivider() {
  return (
    <div className="auth-or">
      <span />
      <p>Hoặc</p>
      <span />
    </div>
  );
}

function SocialButtons({ actionLabel }: { actionLabel: string }) {
  return (
    <div className="auth-socials">
      <button type="button">
        <span className="auth-apple">●</span>
        {actionLabel} với Apple
      </button>
      <button type="button">
        <span className="auth-google">G</span>
        {actionLabel} với Google
      </button>
    </div>
  );
}

function MiniLogo() {
  return (
    <svg viewBox="0 0 44 36" width="44" height="36" aria-hidden>
      <path d="M4 21 22 5l18 16-5 5-13-11L9 26 4 21Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M9 29 22 18l13 11-5 5-8-7-8 7-5-5Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}
