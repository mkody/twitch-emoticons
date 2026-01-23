import Emote from './Emote.js';
import Constants from '../util/Constants.js';

/** @augments Emote */
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
     * @param {object} [options={}] - Options for the link.
     * @param {number} [options.size=0] - Size (scale) for the emote.
     * @param {boolean} [options.forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
     * @returns {string}
     */
    toLink(options = {}) {
        const {
            size = 0,
            forceStatic = this.fetcher.forceStatic || false
        } = options || {};

        return Constants.BTTV.CDN(this.id, size, forceStatic); // eslint-disable-line new-cap
    }

    /**
     * Override for `toObject`.
     * Will result in an Object representation of a BTTVEmote
     * @returns {object}
     */
    toObject() {
        return Object.assign({}, super.toObject(), {
            animated: this.animated,
            ownerName: this.ownerName,
            type: this.type
        });
    }

    /**
     * Converts an emote Object into a BTTVEmote
     * @param {object} [emoteObject] - Object representation of this emote
     * @param {Channel} [channel=null] - Channel this emote belongs to.
     * @returns {BTTVEmote}
     */
    static fromObject(emoteObject, channel = null) {
        return new BTTVEmote(channel, emoteObject.id,
            {
                code: emoteObject.code,
                animated: emoteObject.animated,
                user: {
                    name: emoteObject.ownerName
                }
            });
    }
}

export default BTTVEmote;
