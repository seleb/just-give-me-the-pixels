declare module 'image-decode' {
	function decode(
		buffer: ArrayBuffer | /* Buffer | */ Uint8Array | File | Blob | string,
		mimeType?: string
	): Promise<{
		readonly width: number;
		readonly height: number;
		readonly data: Uint8Array;
	}>;
	export = decode;
}
