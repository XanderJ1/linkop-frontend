import { env } from '$env/dynamic/public';

export const uploadsEnabled = Boolean(
	env.PUBLIC_CLOUDINARY_CLOUD_NAME && env.PUBLIC_CLOUDINARY_UPLOAD_PRESET
);

/** Uploads an image to Cloudinary with an unsigned preset and returns its URL */
export async function uploadImage(file: File): Promise<string> {
	if (!uploadsEnabled) throw new Error('Image uploads are not configured');

	const body = new FormData();
	body.append('file', file);
	body.append('upload_preset', env.PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${env.PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
		{ method: 'POST', body }
	);
	if (!res.ok) throw new Error(`Upload failed (${res.status})`);
	const json = await res.json();
	return json.secure_url as string;
}
