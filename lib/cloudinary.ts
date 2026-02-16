import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export function isCloudinaryConfigured(): boolean {
  return !!(CLOUD_NAME && API_KEY && API_SECRET);
}

function getConfig() {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary no está configurado');
  }
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
}

export interface UploadResult {
  url: string;
  public_id: string;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  eventoId: string
): Promise<UploadResult> {
  getConfig();

  const base64 = buffer.toString('base64');
  const dataUri = `data:${mimeType || 'image/jpeg'};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `eventos/${eventoId}`,
    use_filename: false,
    unique_filename: true,
  });

  return { url: result.secure_url, public_id: result.public_id };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  getConfig();
  await cloudinary.uploader.destroy(publicId);
}

export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/v\d+\/(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
