import { destroyCurrentSession } from "@/lib/auth/session";
import { jsonResponse } from "@/lib/http/json";

export async function POST() {
  await destroyCurrentSession();

  return jsonResponse({ ok: true });
}
