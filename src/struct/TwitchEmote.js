const Emote = require('./Emote');
const Constants = require('../util/Constants');

/**
 * A Twitch emote.
 * @class TwitchEmote
 */
class TwitchEmote extends Emote {
    /**
     * Creates a new Twitch emote.
     * @param {Channel} channel - Channel this emote belongs to.
     * @param {string} id - ID of the emote.
     * @param {data} data - The raw emote data.
     */
    constructor(channel, id, data) {
        super(channel, id, data);
        this.type = 'twitch';
    }

    _setup(data) {
        super._setup(data);

        /**
         * The set ID of the emote.
         * @type {?string}
         */
        this.set = data.set;

        /**
         * The description of the emote.
         * @type {?string}
         */
        this.description = data.description;
    }

    /**
     * Gets the image link of the emote.
     * @param {number} size - The size of the image, 0, 1, or 2.
     * @returns {string}
     */
    toLink(size = 0) {
        return Constants.Twitch.CDN(this.id, size); // eslint-disable-line new-cap
    }
}

module.exports = TwitchEmote;
