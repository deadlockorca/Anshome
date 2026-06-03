"use client";

import { useState } from "react";
import { PublicAuthPanel, type AuthMode } from "@/components/auth/public-auth-panel";

type PublicAuthPageProps = {
  initialMode?: AuthMode;
  nextPath?: string;
};

export function PublicAuthPage({ initialMode = "login", nextPath }: PublicAuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  return (
    <main className="public-auth-page">
      <PublicAuthPanel mode={mode} nextPath={nextPath} onModeChange={setMode} />
    </main>
  );
}
