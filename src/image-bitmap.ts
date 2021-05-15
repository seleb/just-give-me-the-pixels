// @ts-nocheck
// returns the gl context
// if one doesn't exist,
// creates it then returns it
function Gl(canvas, options) {
	if (!Gl.context) {
		Gl.context = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
		if (!Gl.context) {
			throw 'No WebGL support';
		}
	}
	return Gl.context;
}

class Texture {
	constructor(source, id, pixelate) {
		this.gl = new Gl();
		this.source = source;
		this.texture = this.gl.createTexture();
		this.bind(id);

		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.source);
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, pixelate ? this.gl.NEAREST : this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, pixelate ? this.gl.NEAREST : this.gl.LINEAR);

		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}

	/**
	 * Updates the texture from its source
	 */
	update() {
		this.bind();
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.source);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}

	/**
	 * Tells GL to use this texture
	 * @param {int} id The texture bound is `gl.TEXTURE0 + id`; default: 0
	 */
	bind(id) {
		const _id = id || this.lastBoundId || 0;
		this.gl.activeTexture(this.gl.TEXTURE0 + _id);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.lastBoundId = _id;
	}
}

export async function getPixelsViaImageBitmap(src: string) {
	const img = new Image();
	await new Promise((resolve, reject) => {
		img.onload = resolve;
		img.onerror = reject;
		img.src = src;
	});
	const bitmap = await createImageBitmap(img, {
		colorSpaceConversion: 'none',
	});
	const width = bitmap.width;
	const height = bitmap.height;
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const gl = Gl(canvas, {
		alpha: false,
	});

	const tex = new Texture(bitmap, 0, true);
	tex.update();
	tex.bind();
	gl.viewport(0, 0, width, height);
	// make a framebuffer
	const fb = gl.createFramebuffer();

	// make this the current frame buffer
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

	// attach the texture to the framebuffer.
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.texture, 0);

	// read the pixels
	const data = new Uint8Array(width * height * 4);
	gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

	// Unbind the framebuffer
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	return { width, height, data };
}
