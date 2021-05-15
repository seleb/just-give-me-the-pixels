import { getImage } from "./getImage";

export async function getPixelsViaImageData(src: string) {
	const img = await getImage(src);
	const width = img.naturalWidth;
	const height = img.naturalHeight;

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	if (!context) throw new Error('Could not get 2D canvas context');
	canvas.width = width;
	canvas.height = height;
	context.drawImage(img, 0, 0);

	const { data } = context.getImageData(0, 0, width, height);
	return { width, height, data };
}
