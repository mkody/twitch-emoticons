import Emote from './Emote.js'
import Constants from '../util/Constants.js'

/** @augments Emote */
class FFZEmote extends Emote {
  /**
   * An FFZ emote.
   * @param {Channel} channel - Channel this emote belongs to.
   * @param {string} id - ID of the emote.
   * @param {data} data - The raw emote data.
   */
  constructor (channel, id, data) {
    super(channel, id, data)
    this.type = 'ffz'
  }

  _setup (data) {
    /**
     * The code or name of the emote.
     * @type {string}
     */
    this.code = data.name

    /**
     * The name of the emote creator's channel.
     * @type {string | null}
     */
    this.ownerName = 'owner' in data ? data.owner.name : null

    /**
     * Available image sizes.
     * @type {string[]}
     */
    this.sizes = 'animated' in data ? Object.keys(data.animated) : Object.keys(data.urls)

    /**
     * The image type of the emote.
     * @type {'png' | 'webp'}
     */
    this.imageType = 'animated' in data ? 'webp' : 'png'

    /**
     * If emote is animated.
     * @type {boolean}
     */
    this.animated = 'animated' in data

    /**
     * If emote can be zero-width (overlaying).
     * @type {boolean}
     */
    this.zeroWidth = data.modifier && data.modifier_flags === 0

    /**
     * If the emote is a modifier (effect) and should be hidden.
     * @type {boolean}
     */
    this.modifier = data.modifier && (data.modifier_flags & 1) !== 0
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
    if (this.animated && !forceStatic) return Constants.FFZ.CDNAnimated(this.id, sizeKey)
    return Constants.FFZ.CDN(this.id, sizeKey)
  }

  /**
   * Override for `toObject`.
   * Will result in an Object representation of a FFZEmote
   * @returns {object} - Object representation of the FFZEmote.
   */
  toObject () {
    return {
      ...super.toObject(),
      type: this.type,
      ownerName: this.ownerName,
      sizes: this.sizes,
      animated: this.animated,
      zeroWidth: this.zeroWidth,
      modifier: this.modifier,
    }
  }

  /**
   * Converts an emote Object into a FFZEmote
   * @param {object} [emoteObject] - Object representation of this emote
   * @param {Channel} [channel] - Channel this emote belongs to.
   * @returns {FFZEmote} - A FFZEmote instance.
   */
  static fromObject (emoteObject, channel) {
    // Need to convert sizes array to object, e.g. [1, 2, 4] -> { 1: '1', 2: '2', 4: '4' }
    const sizesObj = emoteObject.sizes.reduce(
      (acc, curr) => {
        acc[curr] = curr
        return acc
      },
      {}
    )

    return new FFZEmote(
      channel,
      emoteObject.id,
      {
        code: emoteObject.code,
        name: emoteObject.code,
        urls: sizesObj,
        ...emoteObject.animated ? { animated: sizesObj } : {},
        owner: { name: emoteObject.ownerName },
        modifier: (emoteObject.zeroWidth || emoteObject.modifier),
        modifier_flags: (emoteObject.modifier ? 1 : 0),
      }
    )
  }
}

export default FFZEmote
