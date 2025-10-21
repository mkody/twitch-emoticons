class Emote {
    /**
     * Base class for emotes.
     * This constructor is not to be used.
     * @param {Channel} channel - Channel this emote belongs to.
     * @param {string} id - ID of the emote.
     * @param {data} data - The raw emote data.
     * @throws {Error} When trying to use the base Emote class directly.
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
         * Either `twitch`, `bttv`, `ffz`, or '7tv'.
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

    /**
     * Gets the image link of the emote.
     * @param {number} size - The size of the image.
     * @returns {string}
     */
    /* c8 ignore next 3*/
    toLink() {
        return null;
    }

    /**
     * Override for `toString`.
     * Will give the emote's name.
     * @returns {string}
     */
    /* c8 ignore next 3*/
    toString() {
        return this.code;
    }

    /**
     * Override for `toObject`.
     * Will result in an Object representation of an Emote
     * @returns {object}
     */
    toObject() {
        return {
            code: this.code,
            id: this.id,
            channel_id: this.channel.channel_id
        };
    }
}

module.exports = Emote;
