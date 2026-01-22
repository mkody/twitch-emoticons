import Emote from './Emote.js';
import Constants from '../util/Constants.js';

/** @augments Emote */
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
        this.ownerName = 'owner' in data.data ? data.data.owner.display_name : null;

        /**
         * Available image sizes.
         * @type {string[]}
         */
        this.sizes = data.data.host.files
            .filter(el => el.format === this.channel.format.toUpperCase())
            .map(el => el.name.replace(/x\.(\w+)/, ''));

        /**
         * If emote is animated.
         * @type {boolean}
         */
        this.animated = data.data.animated;

        /**
         * The image type of the emote.
         * @type {string}
         */
        this.imageType = this.channel.format;
    }

    /**
     * Gets the image link of the emote.
     * @param {number} size - The size of the image.
     * @param {boolean} [forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
     * @returns {string}
     */
    toLink(size = 0, forceStatic) {
        size = this.sizes[size];
        return Constants.SevenTV.CDN(this.id, this.imageType, size, forceStatic); // eslint-disable-line new-cap
    }

    /**
     * Override for `toObject`.
     * Will result in an Object representation of a SevenTVEmote
     * @returns {object}
     */
    toObject() {
        return Object.assign({}, super.toObject(), {
            animated: this.animated,
            sizes: this.sizes,
            ownerName: this.ownerName,
            type: this.type,
            imageType: this.imageType
        });
    }

    /**
     * Converts an emote Object into a SevenTVEmote
     * @param {object} [emoteObject] - Object representation of this emote
     * @param {Channel} [channel] - Channel this emote belongs to.
     * @returns {SevenTVEmote}
     */
    static fromObject(emoteObject, channel) {
        const sizes = emoteObject.sizes.map(size => { return { format: channel.format.toUpperCase(), name: size }; });
        return new SevenTVEmote(channel, emoteObject.id,
            {
                code: emoteObject.code,
                name: emoteObject.code,
                data: {
                    animated: emoteObject.animated,
                    owner: {
                        display_name: emoteObject.ownerName
                    },
                    host: {
                        files: sizes
                    }
                }
            });
    }
}

export default SevenTVEmote;
