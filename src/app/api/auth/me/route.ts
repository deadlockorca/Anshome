import { getCurrentSession } from "@/lib/auth/session";
import { jsonResponse } from "@/lib/http/json";

export async function GET() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    return jsonResponse({ user: null }, { status: 401 });
  }

  const { user } = currentSession;

  return jsonResponse({
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      status: user.status,
      profile: user.profile
        ? {
            displayName: user.profile.displayName,
            publicSlug: user.profile.publicSlug,
            verificationStatus: user.profile.verificationStatus,
          }
        : null,
      roles: user.roles.map(({ role, scopeType, scopeId }) => ({
        code: role.code,
        scopeType,
        scopeId,
      })),
    },
  });
}
