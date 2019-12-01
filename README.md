
# Small vinyl-stream wrapper -aka Gulp plugin- for postcss

Run PostCSS within your streams. This fully supports source maps.

> *NOTE:* No tests have been written yet!

## Installation

`yarn install`. Or `npm install`. Or just copy the files to your own project.

## Usage

```javascript
const postcssWrapper = require('@eklingen/vinyl-stream-postcss')
stream.pipe(postcssWrapper())
```

This plugin assumes an existing configuration dotfile where postcss can find it.

## Options

There is one option.

### `postcss`

Both the `plugins` array and the `options` object will be passed to `postcss`. See the ["postcss"](https://www.npmjs.com/package/postcss) for more information.

```javascript
postcssWrapper({
  postcss: {
    plugins: [],
    options: {
      parser: 'scss',
      stringifier: null
    }
  }
})
```

## Dependencies

This package requires ["postcss"](https://www.npmjs.com/package/postcss) and ["vinyl-sourcemaps-apply"](https://www.npmjs.com/package/vinyl-sourcemaps-apply).

---

Copyright (c) 2019 Elco Klingen. MIT License.
