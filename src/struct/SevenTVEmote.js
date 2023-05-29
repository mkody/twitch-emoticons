const Emote = require('./Emote');
const Constants = require('../util/Constants');

/** @extends Emote */
class SevenTVEmote extends Emote {
    /**
     * A 7TV emote.
     * @param {Channel} channel - Channel this emote belongs to.
     * @param {string} id - ID of the emote.
     * @param {data} data - The raw emote data.
     */
    constructor(channel, id, data) {
        super(channel, id, data);
        this.type = '7tv';
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
        this.ownerName = 'owner' in data ? data.owner.display_name : null;

        /**
         * Available image sizes.
         * @type {string[]}
         */
        this.sizes = data.host.files
            .filter(el => el.format === this.channel.format.toUpperCase())
            .map(el => el.name);

        /**
         * If emote is animated.
         * @type {boolean}
         */
        this.animated = data.animated;

        /**
         * The image type of the emote.
         * @type {string}
         */
        this.imageType = this.channel.format;
    }

    /**
     * Gets the image link of the emote.
     * @param {number} size - The size of the image.
     * @returns {string}
     */
    toLink(size = 0) {
        size = this.sizes[size];
        return Constants.SevenTV.CDN(this.id, size); // eslint-disable-line new-cap
    }

    /**
     * Override for `toJSON`.
     * Will result in a JSON representation of a SevenTVEmote
     * @returns {Object}
     */
    toJSON() {
        return Object.assign({}, super.toJSON(), {
            animated: this.animated,
            sizes: this.sizes,
            ownerName: this.ownerName,
            type: this.type
        });
    }

    /**
     * Converts a JSON into a SevenTVEmote
     * @param {JSON} [emoteJSON] - JSON representation of this emote
     * @param {Channel} [channel] - Channel this emote belongs to.
     * @returns {SevenTVEmote}
     */
    static fromJSON(emoteJSON, channel) {
        const sizes = emoteJSON.sizes.map(size => { return { format: channel.format.toUpperCase(), name: size }; });
        return new SevenTVEmote(channel, emoteJSON.id,
            {
                code: emoteJSON.code,
                name: emoteJSON.code,
                animated: emoteJSON.animated,
                owner: {
                    display_name: emoteJSON.ownerName
                },
                host: {
                    files: sizes
                }
            });
    }
}

module.exports = SevenTVEmote;
