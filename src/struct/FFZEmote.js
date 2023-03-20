const Emote = require('./Emote');
const Constants = require('../util/Constants');

/** @extends Emote */
class FFZEmote extends Emote {
    /**
     * An FFZ emote.
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
        this.sizes = 'animated' in data ? Object.keys(data.animated) : Object.keys(data.urls);

        /**
         * If emote is animated.
         * @type {boolean}
         */
        this.animated = 'animated' in data;

        /**
         * The image type of the emote.
         * @type {string}
         */
        this.imageType = 'animated' in data ? 'webp' : 'png';
    }

    /**
     * Gets the image link of the emote.
     * @param {number} size - The size of the image.
     * @returns {string}
     */
    toLink(size = 0) {
        size = this.sizes[size];
        if (this.animated) return Constants.FFZ.CDNAnimated(this.id, size); // eslint-disable-line new-cap
        return Constants.FFZ.CDN(this.id, size); // eslint-disable-line new-cap
    }
}

module.exports = FFZEmote;
