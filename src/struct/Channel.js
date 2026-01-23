import Collection from '../util/Collection.js'

class Channel {
  /**
   * A Twitch channel.
   * @param {EmoteFetcher} fetcher - The emote fetcher.
   * @param {int} id - ID of the channel.
   */
  constructor (fetcher, id) {
    /**
     * The emote fetcher.
     * @type {EmoteFetcher}
     */
    this.fetcher = fetcher

    /**
     * The ID of this channel.
     * For the global channel, the ID will be null.
     * @type {?int}
     */
    this.channel_id = id || null

    /**
     * Cached emotes belonging to this channel.
     * @type {Collection<string, Emote>}
     */
    this.emotes = new Collection()
  }

  /* There are tests that those are returning Collections, but c8 doesn't get it. */
  /* c8 ignore start */

  /**
   * Fetches the BTTV emotes for this channel.
   * @returns {Promise<Collection<string, BTTVEmote>>}
   */
  fetchBTTVEmotes () {
    return this.fetcher.fetchBTTVEmotes(this.id)
  }

  /**
   * Fetches the FFZ emotes for this channel.
   * @returns {Promise<Collection<string, FFZEmote>>}
   */
  fetchFFZEmotes () {
    return this.fetcher.fetchFFZEmotes(this.id)
  }

  /**
   * Fetches the 7TV emotes for this channel.
   * @returns {Promise<Collection<string, SevenTVEmote>>}
   */
  fetchSevenTVEmotes () {
    return this.fetcher.fetchSevenTVEmotes(this.id)
  }

  /* c8 ignore end */
}

export default Channel
