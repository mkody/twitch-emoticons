const Collection = require('../util/Collection');

/**
 * A Twitch channel.
 * @class Channel
 */
class Channel {
    /**
     * Creates a new channel.
     * @param {EmoteFetcher} fetcher - The emote fetcher.
     * @param {string} name - The name of the channel.
     */
    constructor(fetcher, name) {
        /**
         * The emote fetcher.
         * @type {EmoteFetcher}
         */
        this.fetcher = fetcher;

        /**
         * The name of this channel.
         * For the global channel, the name will be null.
         * @type {?string}
         */
        this.name = name;

        /**
         * Cached emotes belonging to this channel.
         * @type {Collection<string, Emote>}
         */
        this.emotes = new Collection();
    }

    /**
     * Fetches the BTTV emotes for this channel.
     * @returns {Promise<Collection<string, BTTVEmote>>}
     */
    fetchBTTVEmotes() {
        return this.fetcher.fetchBTTVEmotes(this.name);
    }

    /**
     * Fetches the FFZ emotes for this channel.
     * @returns {Promise<Collection<string, FFZEmote>>}
     */
    fetchFFZEmotes() {
        return this.fetcher.fetchFFZEmotes(this.name);
    }
}

module.exports = Channel;
