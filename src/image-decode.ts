export async function getPixelsViaImageDecode(src: string) {
	const imageDecode = await import('image-decode');
	console.log(imageDecode);
	const response = await fetch(src);
	if (!response.ok) {
		throw new Error('Issue loading image');
	}

	const buffer = await response.arrayBuffer();
	// HACK: TS complains that `imageDecode.default` should be used, but there is no `.default` in the actual output
	const { width, height, data } = await (imageDecode as unknown as typeof imageDecode['default'])(buffer);
	return { width, height, data };
}
