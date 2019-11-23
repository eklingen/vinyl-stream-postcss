// Small vinyl-stream wrapper -aka Gulp plugin- for postcss.
// Fully supports sourcemaps.

const { Transform } = require('stream')
const { relative } = require('path')

function postcssWrapper (config = { plugins: {}, options: {} }) {
  const applySourceMap = require('vinyl-sourcemaps-apply')
  const postcss = require('postcss')

  async function transform (file, encoding, callback) {
    const DEFAULT_OPTIONS = { from: file.path, to: file.path, map: file.sourceMap ? { inline: false, sourcesContent: true, annotation: false } : false }

    config.options = ({ ...DEFAULT_OPTIONS, ...config.options })

    let result
    const compiler = postcss(config.plugins)

    try {
      result = await compiler.process(file.contents.toString(), config.options)
    } catch (error) {
      if (error.name === 'CssSyntaxError') {
        return callback(new Error(`${error.message}\n${error.showSourceCode()}\n`, { error, fileName: error.file || file.path, lineNumber: error.line, showProperties: false, showStack: false }))
      }

      return callback(new Error(error))
    }

    const warnings = result.warnings()

    if (warnings.length) {
      return callback(new Error(`${file.relative}\n${warnings.join('\n')}`))
    }

    file.contents = Buffer.from(result.css)

    if (file.sourceMap) {
      const map = JSON.parse(result.map)
      applySourceMap(file, ({ ...map, ...{ file: relative(file.base, file.path), sources: map.sources.map(() => relative(file.base, file.path)) } }))
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = postcssWrapper
