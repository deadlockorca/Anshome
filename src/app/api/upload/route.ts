import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentSession } from "@/lib/auth/session";
import { jsonError, jsonResponse } from "@/lib/http/json";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function detectMimeType(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }

  if (buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") {
    return "image/webp";
  }

  if (buffer.length >= 6 && (buffer.subarray(0, 4).toString("ascii") === "GIF87" || buffer.subarray(0, 4).toString("ascii") === "GIF89")) {
    return "image/gif";
  }

  return null;
}

export async function POST(request: Request) {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    return jsonError("Bạn cần đăng nhập để tải lên hình ảnh.", 401);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonError("Cần gửi tệp hình ảnh.", 400);
  }

  if (!allowedMimeTypes.has(file.type)) {
    return jsonError("Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc GIF.", 400);
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    return jsonError("Kích thước ảnh phải nhỏ hơn 8MB.", 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedMimeType = detectMimeType(buffer);

  if (!detectedMimeType || detectedMimeType !== file.type) {
    return jsonError("Tệp không phải ảnh hợp lệ hoặc định dạng không khớp.", 400);
  }

  const extension = extensionByMimeType[detectedMimeType] ?? ".jpg";
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${extension}`;
  const relativeDir = `uploads/${currentSession.user.id}`;
  const directory = path.join(process.cwd(), "public", relativeDir);

  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), buffer);

  return jsonResponse({
    url: `/${relativeDir}/${filename}`,
    mimeType: detectedMimeType,
    sizeBytes: file.size,
  });
}
