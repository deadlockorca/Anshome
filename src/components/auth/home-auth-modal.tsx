"use client";

import { useEffect, useState } from "react";
import { PublicAuthPanel, type AuthMode } from "@/components/auth/public-auth-panel";

export function HomeAuthModal() {
  const [mode, setMode] = useState<AuthMode | null>(null);
  const isOpen = mode !== null;

  function openModal(nextMode: AuthMode) {
    setMode(nextMode);
  }

  function closeModal() {
    setMode(null);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    document.body.classList.add("auth-modal-lock");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("auth-modal-lock");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button type="button" className="auth-link auth-button" onClick={() => openModal("login")}>
        Đăng nhập
      </button>
      <span className="auth-divider" aria-hidden>
        |
      </span>
      <button type="button" className="auth-link auth-button" onClick={() => openModal("register")}>
        Đăng ký
      </button>

      {mode ? (
        <div className="auth-modal-layer" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
          <button type="button" className="auth-modal-backdrop" aria-label="Đóng" onClick={closeModal} />
          <PublicAuthPanel mode={mode} onModeChange={setMode} onClose={closeModal} />
        </div>
      ) : null}
    </>
  );
}
