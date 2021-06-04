# `just-give-me-the-pixels`

get pixel data without colour profile

```sh
npm i just-give-me-the-pixels
```

order of attempts at retrieving pixel data will be:

- loading into an `ImageBitmap` and reading from a WebGL framebuffer
- fetching as a buffer and parsing via [`image-decode`](https://www.npmjs.com/package/image-decode)
- loading into an `img`, drawing into a `canvas`, and reading via `ImageData`

example:

```ts
import { getPixels } from 'just-give-me-the-pixels';
const { width, height, data } = await getPixels('image src.png');
```

note: the primary motivation for this module was to address issues on firefox which have since been fixed in v89
