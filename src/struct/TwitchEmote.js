import Emote from './Emote.js'
import Constants from '../util/Constants.js'

/** @augments Emote */
class TwitchEmote extends Emote {
  /**
   * A Twitch emote.
   * @param {Channel} channel - {@linkcode Channel} this emote belongs to.
   * @param {string} id - ID of the emote.
   * @param {data} data - The raw emote data.
   */
  constructor (channel, id, data) {
    super(channel, id, data)
    this.type = 'twitch'
  }

  _setup (data) {
    super._setup(data)

    /**
     * The set ID of the emote.
     * @type {string | null}
     */
    this.set = data.emoticon_set || null

    /**
     * The image type of the emote.
     * @type {'png' | 'gif'}
     */
    this.imageType = data.formats?.includes('animated') ? 'gif' : 'png'

    /**
     * If the emote is animated.
     * @type {boolean}
     */
    this.animated = data.formats?.includes('animated') || false
  }

  /**
   * Gets the image link of the emote.
   * @param {object} [options] - Options for the link.
   * @param {number} [options.size=0] - Size (scale) for the emote.
   * @param {boolean} [options.forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
   * @param {'dark' | 'light'} [options.themeMode] - Only for Twitch: the preferred theme mode. Defaults to the fetcher's twitchThemeMode or `dark`.
   * @returns {string} - The URL to the emote.
   */
  toLink (options) {
    const {
      size = 0,
      forceStatic = this.fetcher.forceStatic || false,
      themeMode = this.fetcher.twitchThemeMode || 'dark',
    } = options || {}

    return Constants.Twitch.CDN(this.id, size, forceStatic, themeMode)
  }

  /**
   * Override of the override for `toObject`.
   * Will result in an Object representation of a {@linkcode TwitchEmote}.
   * @returns {object} - Object representation of the {@linkcode TwitchEmote}.
   */
  toObject () {
    return {
      ...super.toObject(),
      type: this.type,
      set: this.set,
      animated: this.animated,
    }
  }

  /**
   * Converts an emote Object into a {@linkcode TwitchEmote}
   * @param {object} [emoteObject] - Object representation of this emote
   * @param {Channel} [channel] -{@linkcode Channel} this emote belongs to.
   * @returns {TwitchEmote} - A {@linkcode TwitchEmote} instance.
   */
  static fromObject (emoteObject, channel) {
    return new TwitchEmote(
      channel,
      emoteObject.id,
      {
        code: emoteObject.code,
        animated: emoteObject.animated,
        emoticon_set: emoteObject.set,
        formats: emoteObject.animated ? ['static', 'animated'] : ['static'],
      }
    )
  }
}

export default TwitchEmote
