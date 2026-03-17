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
    // "Active" Emote flag's bitfield (copied in full for reference)
    // https://github.com/SevenTV/SevenTV/blob/cd3d3b183caff640f2f3c41041794d5c71bc2d5d/shared/src/old_types/mod.rs#L710-L715
    const ActiveEmoteFlags = {
      ZeroWidth: 1, // 1 << 0
      OverrideTwitchGlobal: 65536, // 1 << 16
      OverrideTwitchSubscriber: 131072, // 1 << 17
      OverrideBetterTTV: 262144, // 1 << 18
    }

    // Emote flags' bitfield (copied in full for reference)
    // https://github.com/SevenTV/SevenTV/blob/cd3d3b183caff640f2f3c41041794d5c71bc2d5d/shared/src/old_types/mod.rs#L624-L632
    const EmoteFlags = {
      Private: 1, // 1 << 0
      Authentic: 2, // 1 << 1
      ZeroWidth: 256, // 1 << 8
      Sexual: 65536, // 1 << 16
      Epilepsy: 131072, // 1 << 17
      Edgy: 262144, // 1 << 18
      TwitchDisallowed: 16777216, // 1 << 24
    }

    /**
     * The code or name of the emote.
     * @type {string}
     */
    this.code = data.name || data.data.name

    /**
     * The name of the emote owner.
     * Might be null for global emotes.
     * @type {string | null}
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
     * The image type of the emote.
     * @type {string}
     */
    this.imageType = this.channel.format

    /**
     * If the emote is animated.
     * @type {boolean}
     */
    this.animated = Boolean(data.data.animated)

    /**
     * If emote can be zero-width (overlaying).
     * @type {boolean}
     */
    this.zeroWidth = (data.flags & ActiveEmoteFlags.ZeroWidth) !== 0 || (data.data.flags & EmoteFlags.ZeroWidth) !== 0

    /**
     * If emote is NSFW (or Twitch disallowed, just in case).
     * Do note that this flag isn't always applied to what *looks* NSFW.
     * @type {boolean}
     */
    this.nsfw = (data.data.flags & EmoteFlags.Sexual) !== 0 || (data.data.flags & EmoteFlags.TwitchDisallowed) !== 0
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
    const sizes = emoteObject.sizes.map((size) => { return { name: size } })
    const flags = (emoteObject.nsfw ? 65536 : 0) | (emoteObject.zeroWidth ? 256 : 0)

    return new SevenTVEmote(
      channel,
      emoteObject.id,
      {
        name: emoteObject.code,
        data: {
          animated: emoteObject.animated,
          flags,
          host: {
            files: sizes,
          },
          owner: {
            display_name: emoteObject.ownerName,
          },
        },
      }
    )
  }
}

export default SevenTVEmote
