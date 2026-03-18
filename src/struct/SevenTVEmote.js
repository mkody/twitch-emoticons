import Emote from './Emote.js'
import Constants from '../util/Constants.js'

/** @augments Emote */
class SevenTVEmote extends Emote {
  /**
   * A 7TV emote.
   * @param {Channel} channel - {@linkcode Channel} this emote belongs to.
   * @param {string} id - ID of the emote.
   * @param {data} data - The raw emote data.
   */
  constructor (channel, id, data) {
    super(channel, id, data)
    this.type = '7tv'
  }

  _setup (data) {
    // Let's try to find a matching Twitch username in the connections of the emote's owner, otherwise try to use the first username we can get
    const connections = Array.isArray(data.emote.owner?.connections)
      ? data.emote.owner.connections
      : []
    const twitchConnection = connections.find((connection) => connection.platform === 'TWITCH')

    /**
     * The code or name of the emote.
     * @type {string}
     */
    this.code = data.alias || data.emote.defaultName

    /**
     * The name of the emote owner.
     * Might be null for global emotes.
     * @type {string | null}
     */
    this.ownerName = twitchConnection?.platformDisplayName || connections[0]?.platformDisplayName || null

    /**
     * Available image sizes.
     * @type {string[]}
     */
    this.sizes = data.emote.images
      .filter((image) => !image.url?.includes('_static') && image.mime?.includes(this.channel.format))
      .map((image) => String(image.scale))
      .sort((a, b) => Number(a) - Number(b))

    if (this.sizes.length === 0) {
      // This is the current (2026-03-16) documented default, in case the above breaks
      this.sizes = ['1', '2', '3', '4']
    }

    /**
     * The image type of the emote.
     * @type {string}
     */
    this.imageType = this.channel.format

    /**
     * If the emote is animated.
     * @type {boolean}
     */
    this.animated = Boolean(data.emote.flags.animated)

    /**
     * If emote can be zero-width (overlaying).
     * @type {boolean}
     */
    this.zeroWidth = data.flags && 'zeroWidth' in data.flags
      ? Boolean(data.flags.zeroWidth)
      : Boolean(data.emote.flags.defaultZeroWidth)

    /**
     * If emote is NSFW.
     * Do note that this flag isn't always applied to what *looks* NSFW.
     * @type {boolean}
     */
    this.nsfw = Boolean(data.emote.flags.nsfw)
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
   * Override of the override for `toObject`.
   * Will result in an Object representation of a {@linkcode SevenTVEmote}.
   * @returns {object} - Object representation of the {@linkcode SevenTVEmote}.
   */
  toObject () {
    return {
      ...super.toObject(),
      type: this.type,
      ownerName: this.ownerName,
      sizes: this.sizes,
      imageType: this.imageType,
      animated: this.animated,
      zeroWidth: this.zeroWidth,
      nsfw: this.nsfw,
    }
  }

  /**
   * Converts an emote Object into a {@linkcode SevenTVEmote}
   * @param {object} [emoteObject] - Object representation of this emote
   * @param {Channel} [channel] - {@linkcode Channel} this emote belongs to.
   * @returns {SevenTVEmote} - A {@linkcode SevenTVEmote} instance.
   */
  static fromObject (emoteObject, channel) {
    const connections = emoteObject.ownerName
      ? [
          {
            platform: 'TWITCH',
            platformDisplayName: emoteObject.ownerName,
          },
        ]
      : []
    const images = emoteObject.sizes.map((size) => {
      const parsed = Number.parseInt(String(size))
      return {
        mime: `image/${channel.format}`,
        scale: Number.isNaN(parsed) ? 1 : parsed,
      }
    })

    return new SevenTVEmote(
      channel,
      emoteObject.id,
      {
        emote: {
          defaultName: emoteObject.code,
          owner: {
            connections,
          },
          flags: {
            animated: emoteObject.animated || false,
            nsfw: emoteObject.nsfw || false,
            defaultZeroWidth: emoteObject.zeroWidth || false,
          },
          images,
        },
      }
    )
  }
}

export default SevenTVEmote
