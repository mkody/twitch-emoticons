const Emote = require('./Emote');
const Constants = require('../util/Constants');

/**
 * An FFZ emote.
 * @class FFZEmote
 */
class FFZEmote extends Emote {
    /**
     * Creates a new FFZ emote.
     * @param {Channel} channel - Channel this emote belongs to.
     * @param {string} id - ID of the emote.
     * @param {data} data - The raw emote data.
     */
    constructor(channel, id, data) {
        super(channel, id, data);
        this.type = 'ffz';
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
        this.code = data.name;

        /**
         * The name of the emote creator's channel.
         * @type {string}
         */
        this.ownerName = data.owner.name;

        /**
         * Available image sizes.
         * @type {string[]}
         */
        this.sizes = Object.keys(data.urls);

        /**
         * The image type of the emote.
         * @type {string}
         */
        this.imageType = 'png';
    }

    /**
     * Gets the image link of the emote.
     * @param {number} size - The size of the image.
     * @returns {string}
     */
    toLink(size = 0) {
        size = this.sizes[size];
        return Constants.FFZ.CDN(this.id, size); // eslint-disable-line new-cap
    }
}

module.exports = FFZEmote;
