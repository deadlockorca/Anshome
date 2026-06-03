export function readString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeEmail(value: unknown): string | null {
  const email = readString(value)?.toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }

  return email;
}

export function normalizePhone(value: unknown): string | null {
  const phone = readString(value);

  if (!phone || !/^[+0-9][0-9\s().-]{7,24}$/.test(phone)) {
    return null;
  }

  return phone.replace(/[\s().-]/g, "");
}

export function isStrongEnoughPassword(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8;
}
