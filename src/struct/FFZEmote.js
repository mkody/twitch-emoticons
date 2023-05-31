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
     * Override for `toJSON`.
     * Will result in a JSON representation of a FFZEmote
     * @returns {Object}
     */
    toJSON() {
        return Object.assign({}, super.toJSON(), {
            animated: this.animated,
            sizes: this.sizes,
            ownerName: this.ownerName,
            type: this.type,
            modifier: this.modifier
        });
    }

    /**
     * Converts a JSON into a FFZEmote
     * @param {EmoteJSON} [emoteJSON] - JSON representation of this emote
     * @param {Channel} [channel=null] - Channel this emote belongs to.
     * @returns {FFZEmote}
     */
    static fromJSON(emoteJSON, channel = null) {
        // Need to convert sizes array to object, e.g. [1, 2, 4] -> { 1: '1', 2: '2', 4: '4' }
        const sizes_obj = emoteJSON.sizes.reduce((acc, curr) => {
            acc[curr] = curr;
            return acc;
        }, {});
        return new FFZEmote(channel, emoteJSON.id,
            {
                code: emoteJSON.code,
                name: emoteJSON.code,
                urls: sizes_obj,
                ...(emoteJSON.animated ? { animated: sizes_obj } : {}),
                owner: { name: emoteJSON.ownerName },
                modifier: emoteJSON.modifier,
                modifier_flags: emoteJSON.modifier
            });
    }
}

module.exports = FFZEmote;
