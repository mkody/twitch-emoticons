const BTTVEmote = require('./BTTVEmote');
const Channel = require('./Channel');
const Collection = require('../util/Collection');
const Constants = require('../util/Constants');
const FFZEmote = require('./FFZEmote');
const request = require('snekfetch');
const TwitchEmote = require('./TwitchEmote');

/**
 * The fetcher that gets and caches emotes.
 * @class EmoteFetcher
 */
class EmoteFetcher {
    /**
     * Creates a new fetcher.
     */
    constructor() {
        /**
         * Cached emotes.
         * Collectionped by emote code to Emote instance.
         * @type {Collection<string, Emote>}
         */
        this.emotes = new Collection();

        /**
         * Cached channels.
         * Collectionped by name to Channel instance.
         * @type {Collection<string, Channel>}
         */
        this.channels = new Collection();
    }

    /**
     * The global channel for both Twitch and BTTV.
     * @readonly
     * @type {?Channel}
     */
    get globalChannel() {
        return this.channels.get(null);
    }

    /**
     * Gets the raw twitch emotes data.
     * @private
     * @returns {Promise<Object>}
     */
    _getRawTwitchEmotes() {
        return request.get(Constants.Twitch.All).then(res => res.body.images);
    }

    /**
     * Converts and caches a raw twitch emote.
     * @private
     * @param {string} id - ID of the emote.
     * @param {Object} data - Raw data.
     * @returns {TwitchEmote}
     */
    _cacheTwitchEmote(id, data) {
        let channel = this.channels.get(data.channel);
        if (!channel) {
            channel = new Channel(this, data.channel);
            this.channels.set(data.channel, channel);
        }

        channel.title = data.channel_title;
        const emote = new TwitchEmote(channel, id, data);
        this.emotes.set(emote.code, emote);
        channel.emotes.set(emote.code, emote);
        return emote;
    }

    /**
     * Gets the raw BTTV emotes data for a channel.
     * @private
     * @param {string} name - Name of the channel.
     * @returns {Promise<Object[]>}
     */
    _getRawBTTVEmotes(name) {
        const endpoint = !name
        ? Constants.BTTV.Global
        : Constants.BTTV.Channel(name); // eslint-disable-line new-cap

        return request.get(endpoint).then(res => res.body.emotes);
    }

    /**
     * Converts and caches a raw BTTV emote.
     * @private
     * @param {string} name - Name of the channel.
     * @param {Object} data - Raw data.
     * @returns {BTTVEmote}
     */
    _cacheBTTVEmote(name, data) {
        let channel = this.channels.get(name);
        if (!channel) {
            channel = new Channel(this, name);
            this.channels.set(name, channel);
        }

        const emote = new BTTVEmote(channel, data.id, data);
        this.emotes.set(emote.code, emote);
        channel.emotes.set(emote.code, emote);
        return emote;
    }

    /**
     * Gets the raw FFZ emotes data for a channel.
     * @private
     * @param {string} name - Name of the channel.
     * @returns {Promise<Object[]>}
     */
    _getRawFFZEmotes(name) {
        return request.get(Constants.FFZ.Channel(name)).then(res => { // eslint-disable-line new-cap
            const emotes = [];
            for (const key of Object.keys(res.body.sets)) {
                const set = res.body.sets[key];
                emotes.push(...set.emoticons);
            }

            return emotes;
        });
    }

    /**
     * Converts and caches a raw FFZ emote.
     * @private
     * @param {string} name - Name of the channel.
     * @param {Object} data - Raw data.
     * @returns {FFZEmote}
     */
    _cacheFFZEmote(name, data) {
        let channel = this.channels.get(name);
        if (!channel) {
            channel = new Channel(this, name);
            this.channels.set(name, channel);
        }

        const emote = new FFZEmote(channel, data.id, data);
        this.emotes.set(emote.code, emote);
        channel.emotes.set(emote.code, emote);
        return emote;
    }

    /**
     * Fetches and caches all twitch emotes.
     * If channel names are specified, will only cache those channels.
     * Use `null` for the global emotes channel.
     * @param {string|string[]} [names] - Names of channels to cache.
     * @returns {Promise<Collection<string, TwitchEmote>>}
     */
    fetchTwitchEmotes(names) {
        if (names && !Array.isArray(names)) names = [names];
        return this._getRawTwitchEmotes().then(rawEmotes => {
            for (const key of Object.keys(rawEmotes)) {
                const data = rawEmotes[key];
                if (names === undefined || names.includes(data.channel)) {
                    this._cacheTwitchEmote(key, data);
                }
            }

            return this.emotes.filter(e => e.type === 'twitch');
        });
    }

    /**
     * Fetches the BTTV emotes for a channel.
     * Use `null` for the global emotes channel.
     * @param {string} [name=null] - Name of the channel.
     * @returns {Promise<Collection<string, BTTVEmote>>}
     */
    fetchBTTVEmotes(name = null) {
        return this._getRawBTTVEmotes(name).then(rawEmotes => {
            for (const data of rawEmotes) {
                this._cacheBTTVEmote(name, data);
            }

            return this.channels.get(name).emotes.filter(e => e.type === 'bttv');
        });
    }

    /**
     * Fetches the FFZ emotes for a channel.
     * @param {string} name - Name of the channel.
     * @returns {Promise<Collection<string, FFZEmote>>}
     */
    fetchFFZEmotes(name) {
        return this._getRawFFZEmotes(name).then(rawEmotes => {
            for (const data of rawEmotes) {
                this._cacheFFZEmote(name, data);
            }

            return this.channels.get(name).emotes.filter(e => e.type === 'ffz');
        });
    }
}

module.exports = EmoteFetcher;
