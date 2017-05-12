/**
 * Base class for emotes.
 * @class Emote
 */
class Emote {
    /**
     * Creates a new emote.
     * This constructor is not to be used.
     * @param {Channel} channel - Channel this emote belongs to.
     * @param {string} id - ID of the emote.
     * @param {data} data - The raw emote data.
     */
    constructor(channel, id, data) {
        if (new.target.name === Emote.name) {
            throw new Error('Base Emote class cannot be used');
        }

        /**
         * The emote fetcher.
         * @type {EmoteFetcher}
         */
        this.fetcher = channel.fetcher;

        /**
         * The channel this emote belongs to.
         * Only accurate and constant on Twitch emotes.
         * For other types of emotes, use the `owner` or `ownerName` property.
         * @type {Channel}
         */
        this.channel = channel;

        /**
         * The ID of this emote.
         * @type {string}
         */
        this.id = id;

        /**
         * The type of this emote.
         * Either `twitch`, `bttv`, `ffz`.
         * @type {string}
         */
        this.type = null;
        this._setup(data);
    }

    _setup(data) {
        /**
         * The code or name of the emote.
         * @type {string}
         */
        this.code = data.code;
    }

    toLink() {
        return null;
    }

    toString() {
        return this.code;
    }
}

module.exports = Emote;
