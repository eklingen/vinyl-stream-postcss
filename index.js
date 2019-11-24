// Small vinyl-stream wrapper -aka Gulp plugin- for postcss.
// Fully supports sourcemaps.

const { Transform } = require('stream')
const { join, dirname, basename, extname, relative } = require('path')

function postcssWrapper (config = { plugins: {}, options: {} }) {
  const { SourceMapConsumer, SourceMapGenerator } = require('source-map')
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
      const sourceMap = JSON.parse(result.map)

      sourceMap.sources = sourceMap.sources.map((source, index) => ~source.indexOf('file://') ? relative(file.base, source.substr(7)) : source) // Convert absolute to relative paths
      sourceMap.file = join(dirname(file.relative), basename(file.relative, extname(file.relative)) + '.css')

      if (file.sourceMap && (typeof file.sourceMap === 'string' || file.sourceMap instanceof String)) {
        file.sourceMap = JSON.parse(file.sourceMap)
      }

      if (file.sourceMap && file.sourceMap.mappings !== '') {
        file.sourceMap = JSON.parse(SourceMapGenerator.fromSourceMap(new SourceMapConsumer(sourceMap)).applySourceMap(new SourceMapConsumer(file.sourceMap)).toString().applySourceMap(new SourceMapConsumer(file.sourceMap)).toString())
      } else {
        file.sourceMap = sourceMap
      }
    }

    return callback(null, file)
  }

  return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = postcssWrapper
