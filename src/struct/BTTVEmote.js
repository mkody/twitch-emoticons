const Emote = require('./Emote');
const Constants = require('../util/Constants');

/**
 * A BTTV emote.
 * @class BTTVEmote
 */
class BTTVEmote extends Emote {
    /**
     * Creates a new BTTV emote.
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
         * Will be null for global emotes.
         * @type {?string}
         */
        this.ownerName = data.channel;

        /**
         * The image type of the emote.
         * @type {string}
         */
        this.imageType = data.imageType;
    }

    /**
     * Gets the image link of the emote.
     * @param {number} size - The size of the image, 0, 1, or 2.
     * @returns {string}
     */
    toLink(size = 0) {
        return Constants.BTTV.CDN(this.id, size); // eslint-disable-line new-cap
    }
}

module.exports = BTTVEmote;
