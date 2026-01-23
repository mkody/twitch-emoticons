import Constants from '../util/Constants.js'

class EmoteParser {
  /**
   * A parser to replace text with emotes.
   * @param {EmoteFetcher} fetcher - The fetcher to use the cache of.
   * @param {object} [options={}] - Options for the parser.
   * @param {string} [options.template=''] - The template to be used.
   * The strings that can be interpolated are:
   * - `{link}` The link of the emote.
   * - `{name}` The name of the emote.
   * - `{size}` The size index of the image.
   * - `{creator}` The channel/owner name of the emote.
   * @param {string} [options.type='html'] - The type of the parser.
   * Can be one of `html`, `markdown`, `bbcode`, or `plain`.
   * If the `template` option is provided, this is ignored.
   * @param {RegExp} [options.match=/(\w+)/g] - The regular expression that matches an emote.
   * Must be a global regex, with one capture group for the emote code.
   */
  constructor (fetcher, options = {}) {
    /**
     * The emote fetcher being used.
     * @type {EmoteFetcher}
     */
    this.fetcher = fetcher

    /**
     * The parser options.
     * @type {object}
     */
    this.options = Object.assign(
      {
        template: '',
        type: 'html',
        match: /(\w+)/g,
      },
      options
    )

    this._validateOptions(this.options)
  }

  /**
   * Validates the parser options.
   * @private
   * @param {object} [options] - Options for the parser.
   * @param {string} [options.template] - The template to be used.
   * The strings that can be interpolated are:
   * - `{link}` The link of the emote.
   * - `{name}` The name of the emote.
   * - `{size}` The size of the image.
   * - `{creator}` The channel/owner name of the emote.
   * @param {string} [options.type] - The type of the parser.
   * Can be one of  `html`, `markdown`,`bbcode`, or `plain`.
   * If the `template` option is provided, this is ignored.
   * @param {RegExp} [options.match] - The regular expression that matches an emote.
   * Must be a global regex, with one capture group for the emote code.
   * @throws {TypeError} When template is not a string.
   * @throws {TypeError} When type is not one of the supported types.
   * @throws {TypeError} When match is not a global RegExp.
   */
  _validateOptions (options) {
    if (options.template && typeof options.template !== 'string') {
      throw new TypeError('Template must be a string')
    }

    if (!['html', 'markdown', 'bbcode', 'plain'].includes(options.type)) {
      throw new TypeError('Parse type must be one of `html`, `markdown`, `bbcode`, or `plain`')
    }

    if (!(options.match instanceof RegExp) || !options.match.global) {
      throw new TypeError('Match must be a global RegExp.')
    }
  }

  /**
   * Parses text.
   * @param {string} text - Text to parse.
   * @param {object} [options] - Parameters for parsing.
   * @param {number} [options.size] - Size (scale) for emotes.
   * @param {boolean} [options.forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
   * @param {'dark' | 'light'} [options.themeMode] - Only for Twitch: the preferred theme mode. Defaults to the fetcher's twitchThemeMode or `dark`.
   * @returns {string}
   */
  parse (text, options) {
    // @NOTE(kody): Not setting defaults here, they'll be handled by each emote's toLink method.
    const {
      size,
      forceStatic,
      themeMode,
    } = options || {}

    const parsed = text.replace(this.options.match, (matched, id) => {
      const emote = this.fetcher.emotes.get(id)
      if (!emote) return matched
      if (emote.modifier) return ''

      const template = this.options.template || Constants.Templates[this.options.type]
      const link = emote.toLink({ size, forceStatic, themeMode })
      const res = template
        .replace(/{link}/g, link)
        .replace(/{name}/g, emote.code)
        .replace(/{size}/g, size)
        .replace(/{creator}/g, emote.ownerName || 'global')

      return res
    })

    return parsed
  }
}

export default EmoteParser
