import { getPixelsViaImageBitmap } from './image-bitmap';
import { getPixelsViaImageData } from './image-data';
import { getPixelsViaImageDecode } from './image-decode';

/**
 * get pixel data without colour profile
 *
 * order of attempts at retrieving pixel data will be:
 * - loading into an `ImageBitmap` and reading from a WebGL framebuffer
 * - fetching as a buffer and parsing via [`image-decode`](https://www.npmjs.com/package/image-decode)
 * - loading into an `img`, drawing into a `canvas`, and reading via `ImageData`
 *
 * example:
 * ```ts
 * import { getPixels } from 'just-give-me-the-pixels';
 * const { width, height, data } = await getPixels('image src.png');
 * ```
 *
 * @param src image source
 * @returns image width, height, and data
 */
export function getPixels(src: string) {
	return getPixelsViaImageBitmap(src)
		.catch(() => getPixelsViaImageDecode(src))
		.catch(() => getPixelsViaImageData(src));
}
