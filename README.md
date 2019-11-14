
# Small vinyl-stream wrapper -aka Gulp plugin- for postcss

Run PostCSS within your streams. This fully supports sourcemaps.

> *NOTE:* No tests have been written yet!

## Installation

`yarn install`. Or `npm install`. Or just copy the files to your own project.

## Usage

```
const postcssWrapper = require('@eklingen/vinyl-stream-postcss')
stream.pipe(postcssWrapper())
```

This plugin assumes an existing configuration dotfile where postcss can find it.

## Dependencies

This package requires ["postcss"](https://www.npmjs.com/package/postcss) and ["vinyl-sourcemaps-apply"](https://www.npmjs.com/package/vinyl-sourcemaps-apply).

---

Copyright (c) 2019 Elco Klingen. MIT License.
