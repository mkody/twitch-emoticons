import Emote from './Emote.js';
import Constants from '../util/Constants.js';

/** @augments Emote */
class TwitchEmote extends Emote {
    /**
     * A Twitch emote.
     * @param {Channel} channel - Channel this emote belongs to.
     * @param {string} id - ID of the emote.
     * @param {data} data - The raw emote data.
     */
    constructor(channel, id, data) {
        super(channel, id, data);
        this.type = 'twitch';
    }

    /**
     * The channel of this emote's creator.
     * @readonly
     * @type {Channel}
     */
    get owner() {
        return this.channel;
    }

    _setup(data) {
        super._setup(data);

        /**
         * The set ID of the emote.
         * @type {?string}
         */
        this.set = data.emoticon_set;

        /**
         * If emote is animated.
         * @type {boolean}
         */
        this.animated = 'animated' in data.formats;

        /**
         * The image type of the emote.
         * @type {string}
         */
        this.imageType = 'animated' in data.formats ? 'gif' : 'png';
    }

    /**
     * Gets the image link of the emote.
     * @param {number} size - The size of the image, 0, 1, or 2.
     * @param {boolean} [forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
     * @param {'light' | 'dark'} [themeMode] - The preferred theme mode. Defaults to the fetcher's twitchThemeMode or `dark`.
     * @returns {string}
     */
    toLink(size = 0, forceStatic, themeMode) {
        const theme = themeMode || (this.channel && this.channel.fetcher ? this.channel.fetcher.twitchThemeMode : 'dark');
        return Constants.Twitch.CDN(this.id, size, forceStatic, theme); // eslint-disable-line new-cap
    }

    /**
     * Override for `toObject`.
     * Will result in an Object representation of a TwitchEmote
     * @returns {object}
     */
    toObject() {
        return Object.assign({}, super.toObject(), {
            animated: this.animated,
            set: this.set,
            type: this.type
        });
    }

    /**
     * Converts an emote Object into a TwitchEmote
     * @param {object} [emoteObject] - Object representation of this emote
     * @param {Channel} [channel=null] - Channel this emote belongs to.
     * @returns {TwitchEmote}
     */
    static fromObject(emoteObject, channel = null) {
        return new TwitchEmote(channel, emoteObject.id,
            {
                code: emoteObject.code,
                animated: emoteObject.animated,
                emoticon_set: emoteObject.set,
                formats: emoteObject.animated ? { animated: emoteObject.animated } : {}
            });
    }
}

export default TwitchEmote;
