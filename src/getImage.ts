export async function getImage(src: string) {
	const img = new Image();
	await new Promise((resolve, reject) => {
		img.onload = resolve;
		img.onerror = reject;
		img.src = src;
	});
	return img;
}
