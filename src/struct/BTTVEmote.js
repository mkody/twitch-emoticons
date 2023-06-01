const Emote = require('./Emote');
const Constants = require('../util/Constants');

/** @extends Emote */
class BTTVEmote extends Emote {
    /**
     * A BTTV emote.
     * @param {Channel} channel - Channel this emote belongs to.
     * @param {string} id - ID of the emote.
     * @param {data} data - The raw emote data.
     */
    constructor(channel, id, data) {
        super(channel, id, data);
        this.type = 'bttv';
    }

    /**
     * The channel of this emote's creator.
     * Not guaranteed to contain the emote, or be cached.
     * @readonly
     * @type {?Channel}
     */
    get owner() {
        return this.fetcher.channels.get(this.ownerName);
    }

    _setup(data) {
        super._setup(data);

        /**
         * The name of the emote creator's channel.
         * Will be null for global or channel emotes.
         * @type {?string}
         */
        this.ownerName = 'user' in data ? data.user.name : null;

        /**
         * If emote is animated.
         * @type {boolean}
         */
        this.animated = data.animated;

        /**
         * The image type of the emote.
         * @type {string}
         */
        this.imageType = 'webp';
    }

    /**
     * Gets the image link of the emote.
     * @param {number} size - The size of the image, 0, 1, or 2.
     * @returns {string}
     */
    toLink(size = 0) {
        return Constants.BTTV.CDN(this.id, size); // eslint-disable-line new-cap
    }

    /**
     * Override for `toJSON`.
     * Will result in a JSON representation of a BTTVEmote
     * @returns {Object}
     */
    toJSON() {
        return Object.assign({}, super.toJSON(), {
            animated: this.animated,
            ownerName: this.ownerName,
            type: this.type
        });
    }

    /**
     * Converts a JSON into a BTTVEmote
     * @param {Object} [emoteJSON] - JSON representation of this emote
     * @param {Channel} [channel=null] - Channel this emote belongs to.
     * @returns {BTTVEmote}
     */
    static fromJSON(emoteJSON, channel = null) {
        return new BTTVEmote(channel, emoteJSON.id,
            {
                code: emoteJSON.code,
                animated: emoteJSON.animated,
                user: {
                    name: emoteJSON.ownerName
                }
            });
    }
}

module.exports = BTTVEmote;
