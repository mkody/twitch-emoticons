class Emote {
  /**
   * Base class for emotes.
   * This constructor is not to be used directly.
   * @param {Channel} channel - {@linkcode Channel} this emote belongs to.
   * @param {string} id - ID of the emote.
   * @param {data} data - The raw emote data.
   * @throws {Error} When trying to use the base Emote class directly.
   */
  constructor (channel, id, data) {
    if (new.target === Emote) {
      // This is NOT a bug.
      // Instantiate the appropriate emote class (e.g. TwitchEmote) instead of this.
      throw new Error('Base Emote class cannot be used')
    }

    /**
     * The {@linkcode EmoteFetcher} being used.
     * @type {EmoteFetcher}
     */
    this.fetcher = channel.fetcher

    /**
     * The {@linkcode Channel} this emote belongs to.
     * Only accurate and constant on Twitch emotes.
     * For other types of emotes, use the `ownerName` property.
     * @type {Channel}
     */
    this.channel = channel

    /**
     * The ID of this emote.
     * @type {string}
     */
    this.id = id

    /**
     * The type/platform of this emote.
     * @type {'twitch' | 'bttv' | 'ffz' | '7tv' | null}
     */
    this.type = null

    this._setup(data)
  }

  _setup (data) {
    /**
     * The code or name of the emote.
     * @type {string}
     */
    this.code = data.code
  }

  /**
   * Gets the image link of the emote.
   * @param {number} size - The size of the image.
   * @returns {string} - The URL to the emote.
   */
  /* c8 ignore next 3 */
  toLink () {
    return ''
  }

  /**
   * Override for `toString`.
   * Will give the emote's name.
   * @returns {string} - The emote code.
   */
  /* c8 ignore next 3 */
  toString () {
    return this.code
  }

  /**
   * Override for `toObject`.
   * Will result in an Object representation of an {@linkcode Emote}.
   * @returns {object} - Object representation of the {@linkcode Emote}.
   */
  toObject () {
    return {
      code: this.code,
      id: this.id,
      channel_id: this.channel?.channel_id || null,
      type: this.type,
    }
  }
}

export default Emote
