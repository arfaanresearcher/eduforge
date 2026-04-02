import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";

const isConfigured =
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_ACCESS_KEY_ID !== "placeholder";

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: isConfigured
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    : undefined,
});

const BUCKET = process.env.S3_BUCKET ?? "eduforge-assets";

export async function uploadFile(
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  if (!isConfigured) {
    console.warn("AWS S3 not configured. Returning placeholder URL.");
    return `https://${BUCKET}.s3.amazonaws.com/${key}`;
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  return `https://${BUCKET}.s3.amazonaws.com/${key}`;
}

export async function getSignedUrl(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  if (!isConfigured) {
    return `https://${BUCKET}.s3.amazonaws.com/${key}?placeholder=true`;
  }

  return s3GetSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn },
  );
}

export async function deleteFile(key: string): Promise<void> {
  if (!isConfigured) {
    console.warn("AWS S3 not configured. Skipping delete.");
    return;
  }

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export async function uploadCertificatePDF(
  certificateId: string,
  pdfBuffer: Buffer,
): Promise<string> {
  const key = `certificates/${certificateId}.pdf`;
  return uploadFile(key, pdfBuffer, "application/pdf");
}
