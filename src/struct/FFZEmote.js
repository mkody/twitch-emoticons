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
         * @type {?string}
         */
        this.ownerName = 'owner' in data ? data.owner.name : null;

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

        /**
         * If the emote is a modifier and should be hidden.
         * @type {boolean}
         */
        this.modifier = data.modifier && (data.modifier_flags & 1) !== 0;
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

    /**
     * Override for `toObject`.
     * Will result in an Object representation of a FFZEmote
     * @returns {Object}
     */
    toObject() {
        return Object.assign({}, super.toObject(), {
            animated: this.animated,
            sizes: this.sizes,
            ownerName: this.ownerName,
            type: this.type,
            modifier: this.modifier
        });
    }

    /**
     * Converts an emote Object into a FFZEmote
     * @param {Object} [emoteObject] - Object representation of this emote
     * @param {Channel} [channel=null] - Channel this emote belongs to.
     * @returns {FFZEmote}
     */
    static fromObject(emoteObject, channel = null) {
        // Need to convert sizes array to object, e.g. [1, 2, 4] -> { 1: '1', 2: '2', 4: '4' }
        const sizes_obj = emoteObject.sizes.reduce((acc, curr) => {
            acc[curr] = curr;
            return acc;
        }, {});
        return new FFZEmote(channel, emoteObject.id,
            {
                code: emoteObject.code,
                name: emoteObject.code,
                urls: sizes_obj,
                ...emoteObject.animated ? { animated: sizes_obj } : {},
                owner: { name: emoteObject.ownerName },
                modifier: emoteObject.modifier,
                modifier_flags: emoteObject.modifier
            });
    }
}

module.exports = FFZEmote;
