import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const UPLOAD_MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
};

export function partnerLogoExtension(contentType: string): string | null {
  return UPLOAD_MIME_TO_EXT[contentType] ?? null;
}

export function isS3PartnerUploadConfigured(): boolean {
  return Boolean(
    process.env.S3_BUCKET?.trim() &&
      process.env.S3_ACCESS_KEY_ID?.trim() &&
      process.env.S3_SECRET_ACCESS_KEY?.trim() &&
      process.env.S3_PUBLIC_BASE_URL?.trim()
  );
}

export type PartnerLogoStorageMode = "blob" | "s3" | "local";

export function getPartnerLogoStorageMode(): PartnerLogoStorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return "blob";
  if (isS3PartnerUploadConfigured()) return "s3";
  return "local";
}

/**
 * Persists partner logo bytes. Priority: Vercel Blob → S3-compatible → local public dir.
 */
export async function persistPartnerLogoImage(
  buf: Buffer,
  contentType: string
): Promise<{ publicUrl: string }> {
  const ext = partnerLogoExtension(contentType);
  if (!ext) {
    throw new Error("Unsupported image type");
  }

  const filename = `partner-${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
  const objectKey = `partners/${filename}`;

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (blobToken) {
    const { put } = await import("@vercel/blob");
    const blob = await put(objectKey, buf, {
      access: "public",
      token: blobToken,
    });
    return { publicUrl: blob.url };
  }

  if (isS3PartnerUploadConfigured()) {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const bucket = process.env.S3_BUCKET!.trim();
    const region = process.env.S3_REGION?.trim() || "us-east-1";
    const endpoint = process.env.S3_ENDPOINT?.trim();
    const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true";

    const client = new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!.trim(),
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!.trim(),
      },
    });

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: buf,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const base = process.env.S3_PUBLIC_BASE_URL!.replace(/\/$/, "");
    return { publicUrl: `${base}/${objectKey}` };
  }

  const dir = join(process.cwd(), "public", "uploads", "partners");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), buf);
  return { publicUrl: `/uploads/partners/${filename}` };
}
