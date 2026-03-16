import Emote from './Emote.js'
import Constants from '../util/Constants.js'

/** @augments Emote */
class SevenTVEmote extends Emote {
  /**
   * A 7TV emote.
   * @param {Channel} channel - Channel this emote belongs to.
   * @param {string} id - ID of the emote.
   * @param {data} data - The raw emote data.
   */
  constructor (channel, id, data) {
    super(channel, id, data)
    this.type = '7tv'
  }

  _setup (data) {
    super._setup(data)

    // First is the possible alias, then fallback to the default name
    this.code = data.name || data.data.name

    /**
     * The name of the emote creator's channel.
     * @type {?string}
     */
    this.ownerName = data.data.owner?.display_name || null

    /**
     * Available image sizes.
     * @type {string[]}
     */
    this.sizes = data.data.host.files
      .map((el) => el.name.replace(/x\.(\w+)/, ''))
      .sort((a, b) => Number(a) - Number(b))

    if (this.sizes.length === 0) {
      // This is the current (2026-03-16) documented default, in case the above breaks
      this.sizes = ['1', '2', '3', '4']
    }

    /**
     * If emote is animated.
     * @type {boolean}
     */
    this.animated = Boolean(data.data.animated)

    /**
     * The image type of the emote.
     * @type {string}
     */
    this.imageType = this.channel.format
  }

  /**
   * Gets the image link of the emote.
   * @param {object} [options] - Options for the link.
   * @param {number} [options.size=0] - Size (scale) for the emote.
   * @param {boolean} [options.forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
   * @returns {string} - The URL to the emote.
   */
  toLink (options) {
    const {
      size = 0,
      forceStatic = this.fetcher.forceStatic || false,
    } = options || {}

    const sizeKey = this.sizes[size]
    return Constants.SevenTV.CDN(this.id, this.imageType, sizeKey, forceStatic)
  }

  /**
   * Override for `toObject`.
   * Will result in an Object representation of a SevenTVEmote
   * @returns {object} - Object representation of the SevenTVEmote.
   */
  toObject () {
    return {
      ...super.toObject(),
      animated: this.animated,
      sizes: this.sizes,
      ownerName: this.ownerName,
      type: this.type,
      imageType: this.imageType,
    }
  }

  /**
   * Converts an emote Object into a SevenTVEmote
   * @param {object} [emoteObject] - Object representation of this emote
   * @param {Channel} [channel] - Channel this emote belongs to.
   * @returns {SevenTVEmote} - A SevenTVEmote instance.
   */
  static fromObject (emoteObject, channel) {
    const sizes = emoteObject.sizes.map((size) => { return { name: size } })

    return new SevenTVEmote(
      channel,
      emoteObject.id,
      {
        name: emoteObject.code,
        data: {
          animated: emoteObject.animated,
          owner: {
            display_name: emoteObject.ownerName,
          },
          host: {
            files: sizes,
          },
        },
      }
    )
  }
}

export default SevenTVEmote
