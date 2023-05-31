const Emote = require('./Emote');
const Constants = require('../util/Constants');

/** @extends Emote */
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
     * @returns {string}
     */
    toLink(size = 0) {
        return Constants.Twitch.CDN(this.id, size); // eslint-disable-line new-cap
    }

    /**
     * Override for `toJSON`.
     * Will result in a JSON representation of a TwitchEmote
     * @returns {Object}
     */
    toJSON() {
        return Object.assign({}, super.toJSON(), {
            animated: this.animated,
            set: this.set,
            type: this.type
        });
    }

    /**
     * Converts a JSON into a TwitchEmote
     * @param {EmoteJSON} [emoteJSON] - JSON representation of this emote
     * @param {Channel} [channel=null] - Channel this emote belongs to.
     * @returns {TwitchEmote}
     */
    static fromJSON(emoteJSON, channel = null) {
        return new TwitchEmote(channel, emoteJSON.id,
            {
                code: emoteJSON.code,
                animated: emoteJSON.animated,
                emoticon_set: emoteJSON.set,
                formats: emoteJSON.animated ? { animated: emoteJSON.animated } : {}
            });
    }
}

module.exports = TwitchEmote;
