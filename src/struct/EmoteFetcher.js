const BTTVEmote = require('./BTTVEmote');
const Channel = require('./Channel');
const Collection = require('../util/Collection');
const Constants = require('../util/Constants');
const FFZEmote = require('./FFZEmote');
const got = require('got');
const TwitchEmote = require('./TwitchEmote');
const { ApiClient } = require('@twurple/api');
const { ClientCredentialsAuthProvider } = require('@twurple/auth');

const options = {
    responseType: 'json'
};

class EmoteFetcher {
    /**
     * Fetches and caches emotes.
     * @param {string} clientId The client id for the twitch api.
     * @param {string} clientSecret The client secret for the twitch api.
     */
    constructor(clientId, clientSecret) {
        if (clientId !== undefined && clientSecret !== undefined) {
            const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);

            /**
             * Twitch api client.
             */
            this.apiClient = new ApiClient({ authProvider });
        }

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
     * Gets the raw Twitch emotes data for a channel.
     * @private
     * @param {int} id - Name of the channel.
     * @returns {Promise<Object[]>}
     */
    _getRawTwitchEmotes(id) {
        if (!this.apiClient) {
            throw new Error('Client id or client secret not provided.');
        }

        if (id) {
            return this.apiClient.chat.getChannelEmotes(id);
        } else {
            return this.apiClient.chat.getGlobalEmotes();
        }
    }

    /**
     * Converts and caches a raw twitch emote.
     * @private
     * @param {string} name - Name of the channel.
     * @param {Object} data - Raw data.
     * @returns {TwitchEmote}
     */
    _cacheTwitchEmote(name, data) {
        let channel = this.channels.get(name);
        if (!channel) {
            channel = new Channel(this, name);
            this.channels.set(name, channel);
        }

        const emote = new TwitchEmote(channel, data.id, data);
        this.emotes.set(emote.code, emote);
        channel.emotes.set(emote.code, emote);
        return emote;
    }

    /**
     * Gets the raw BTTV emotes data for a channel.
     * Use `null` for the global emotes channel.
     * @private
     * @param {int} [id=null] - ID of the channel.
     * @returns {Promise<Object[]>}
     */
    _getRawBTTVEmotes(id) {
        const endpoint = !id
            ? Constants.BTTV.Global
            : Constants.BTTV.Channel(id); // eslint-disable-line new-cap

        return got(endpoint, options).then(req => {
            // Global emotes
            if (req.body instanceof Array) return req.body;
            // Channel emotes
            return [...req.body.channelEmotes, ...req.body.sharedEmotes];
        });
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
     * @param {(number|string)} id - ID or name of the channel.
     * @returns {Promise<Object[]>}
     */
    _getRawFFZEmotes(id) {
        let endpoint;

        if (typeof id === 'number') {
            endpoint = Constants.FFZ.Channel(id); // eslint-disable-line new-cap
        } else {
            endpoint = Constants.FFZ.ChannelName(id); // eslint-disable-line new-cap
        }

        return got(endpoint, options).then(req => {
            const emotes = [];
            for (const key of Object.keys(req.body.sets)) {
                const set = req.body.sets[key];
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
     * Fetches the Twitch emotes for a channel.
     * Use `null` for the global emotes channel.
     * @param {int} [id=null] - ID of the channel.
     * @returns {Promise<Collection<string, TwitchEmote>>}
     */
    fetchTwitchEmotes(id = null) {
        return this._getRawTwitchEmotes(id).then(rawEmotes => {
            for (const emote of rawEmotes) {
                this._cacheTwitchEmote(id, { code: emote.name, id: emote.id });
            }

            return this.channels.get(id).emotes.filter(e => e.type === 'twitch');
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
