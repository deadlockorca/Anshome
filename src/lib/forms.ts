export function formString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function formBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export function formInt(formData: FormData, key: string, fallback = 0): number {
  const value = formString(formData, key);

  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formDecimalString(formData: FormData, key: string): string | null {
  const value = formString(formData, key);

  if (!value) {
    return null;
  }

  return /^-?\d+(\.\d+)?$/.test(value) ? value : null;
}
