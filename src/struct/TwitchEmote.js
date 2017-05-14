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
     * The name of the emote creator's channel.
     * Will be null for global emotes.
     * @type {?string}
     */
    get ownerName() {
        return this.channel.name;
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
        this.set = data.set;

        /**
         * The description of the emote.
         * @type {?string}
         */
        this.description = data.description;

        /**
         * The image type of the emote.
         * @type {string}
         */
        this.imageType = 'png';
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
