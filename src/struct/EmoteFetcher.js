const BTTVEmote = require('./BTTVEmote');
const Channel = require('./Channel');
const Collection = require('../util/Collection');
const Constants = require('../util/Constants');
const FFZEmote = require('./FFZEmote');
const SevenTVEmote = require('./SevenTVEmote');
const TwitchEmote = require('./TwitchEmote');

const axios = require('axios');
const { ApiClient } = require('@twurple/api');
const { AppTokenAuthProvider } = require('@twurple/auth');

class EmoteFetcher {
    /**
     * Fetches and caches emotes.
     * @param {string} clientId The client id for the twitch api.
     * @param {string} clientSecret The client secret for the twitch api.
     */
    constructor(clientId, clientSecret) {
        if (clientId !== undefined && clientSecret !== undefined) {
            const authProvider = new AppTokenAuthProvider(clientId, clientSecret);

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

        /**
         * Save if we fetched FFZ's modifier emotes once.
         * @type {boolean}
         */
        this.ffzModifiersFetched = false;
    }

    /**
     * The global channel for Twitch, BTTV and 7TV.
     * @readonly
     * @type {?Channel}
     */
    get globalChannel() {
        return this.channels.get(null);
    }

    /**
     * Gets the raw Twitch emotes data for a channel.
     * @private
     * @param {int} id - ID of the channel.
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
     * @param {int} channel_id - ID of the channel.
     * @param {Object} data - Raw data.
     * @param {TwitchEmote} [existing_emote=null] - Existing emote to cache.
     * @returns {TwitchEmote}
     */
    _cacheTwitchEmote(channel_id, data, existing_emote = null) {
        const channel = this._setupChannel(channel_id);
        const emote = existing_emote || new TwitchEmote(channel, data.id, data);
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

        return axios.get(endpoint).then(req => {
            // Global emotes
            if (req.data instanceof Array) return req.data;
            // Channel emotes
            return [...req.data.channelEmotes, ...req.data.sharedEmotes];
        });
    }

    /**
     * Converts and caches a raw BTTV emote.
     * @private
     * @param {int} channel_id - ID of the channel.
     * @param {Object} data - Raw data.
     * @param {BTTVEmote} [existing_emote=null] - Existing emote to cache.
     * @returns {BTTVEmote}
     */
    _cacheBTTVEmote(channel_id, data, existing_emote = null) {
        const channel = this._setupChannel(channel_id);
        const emote = existing_emote || new BTTVEmote(channel, data.id, data);
        this.emotes.set(emote.code, emote);
        channel.emotes.set(emote.code, emote);
        return emote;
    }

    /**
     * Gets the raw FFZ emote data from a set.
     * @private
     * @param {int} id - ID of the set.
     * @returns {Promise<Object[]>}
     */
    _getRawFFZEmoteSet(id) {
        const endpoint = Constants.FFZ.Set(id); // eslint-disable-line new-cap

        return axios.get(endpoint).then(req => {
            return req.data.set.emoticons;
        });
    }

    /**
     * Gets the raw FFZ emotes data for a channel.
     * @private
     * @param {int} id - ID of the channel.
     * @returns {Promise<Object[]>}
     */
    _getRawFFZEmotes(id) {
        const endpoint = Constants.FFZ.Channel(id); // eslint-disable-line new-cap

        return axios.get(endpoint).then(req => {
            const emotes = [];
            for (const key of Object.keys(req.data.sets)) {
                const set = req.data.sets[key];
                emotes.push(...set.emoticons);
            }

            return emotes;
        });
    }

    /**
     * Converts and caches a raw FFZ emote.
     * @private
     * @param {int} channel_id - ID of the channel.
     * @param {Object} data - Raw data.
     * @param {FFZEmote} [existing_emote=null] - Existing emote to cache.
     * @returns {FFZEmote}
     */
    _cacheFFZEmote(channel_id, data, existing_emote = null) {
        const channel = this._setupChannel(channel_id);
        const emote = existing_emote || new FFZEmote(channel, data.id, data);
        this.emotes.set(emote.code, emote);
        channel.emotes.set(emote.code, emote);
        return emote;
    }

    /**
     * Gets the raw 7TV emotes data for a channel.
     * @private
     * @param {int} [id=null] - ID of the channel.
     * @returns {Promise<Object[]>}
     */
    _getRawSevenTVEmotes(id) {
        const endpoint = !id
            ? Constants.SevenTV.Global
            : Constants.SevenTV.Channel(id); // eslint-disable-line new-cap

        return axios.get(endpoint).then(req => req.data);
    }

    /**
     * Converts and caches a raw 7TV emote.
     * @private
     * @param {int} channel_id - ID of the channel.
     * @param {Object} data - Raw data.
     * @param {string} format - The type file format to use (webp/avif).
     * @param {SevenTVEmote} [existing_emote=null] - Existing emote to cache.
     * @returns {SevenTVEmote}
     */
    _cacheSevenTVEmote(channel_id, data, format, existing_emote = null) {
        const channel = this._setupChannel(channel_id, format);
        const emote = existing_emote || new SevenTVEmote(channel, data.id, data);
        this.emotes.set(emote.code, emote);
        channel.emotes.set(emote.code, emote);
        return emote;
    }

    /**
     * Fetches the Twitch emotes for a channel.
     * Use `null` for the global emotes channel.
     * @param {int} [channel=null] - ID of the channel.
     * @returns {Promise<Collection<string, TwitchEmote>>}
     */
    fetchTwitchEmotes(channel = null) {
        return this._getRawTwitchEmotes(channel).then(rawEmotes => {
            for (const emote of rawEmotes) {
                this._cacheTwitchEmote(channel, {
                    code: emote.name, id: emote.id, formats: emote.formats
                });
            }

            return this.channels.get(channel).emotes.filter(e => e.type === 'twitch');
        });
    }

    /**
     * Fetches the BTTV emotes for a channel.
     * Use `null` for the global emotes channel.
     * @param {int} [channel=null] - ID of the channel.
     * @returns {Promise<Collection<string, BTTVEmote>>}
     */
    fetchBTTVEmotes(channel = null) {
        return this._getRawBTTVEmotes(channel).then(rawEmotes => {
            for (const data of rawEmotes) {
                this._cacheBTTVEmote(channel, data);
            }

            return this.channels.get(channel).emotes.filter(e => e.type === 'bttv');
        });
    }

    /**
     * Fetches the FFZ emotes for a channel.
     * @param {int} [channel=null] - ID of the channel.
     * @returns {Promise<Collection<string, FFZEmote>>}
     */
    async fetchFFZEmotes(channel) {
        // Fetch modifier emotes at least once
        if (!this.ffzModifiersFetched) {
            this.ffzModifiersFetched = true;

            await this._getRawFFZEmoteSet(Constants.FFZ.sets.Modifiers).then(rawEmotes => {
                for (const data of rawEmotes) {
                    this._cacheFFZEmote(null, data);
                }
            });
        }

        // If no channel specified, fetch the Global set
        if (!channel) {
            return this._getRawFFZEmoteSet(Constants.FFZ.sets.Global).then(rawEmotes => {
                for (const data of rawEmotes) {
                    this._cacheFFZEmote(channel, data);
                }

                return this.channels.get(channel).emotes.filter(e => e.type === 'ffz');
            });
        }

        return this._getRawFFZEmotes(channel).then(rawEmotes => {
            for (const data of rawEmotes) {
                this._cacheFFZEmote(channel, data);
            }

            return this.channels.get(channel).emotes.filter(e => e.type === 'ffz');
        });
    }

    /**
     * Fetches the 7TV emotes for a channel.
     * @param {int} [channel=null] - ID of the channel.
     * @param {('webp'|'avif')} [format='webp'] - The type file format to use (webp/avif).
     * @returns {Promise<Collection<string, SevenTVEmote>>}
     */
    fetchSevenTVEmotes(channel = null, format = 'webp') {
        return this._getRawSevenTVEmotes(channel).then(rawEmotes => {
            if ('emotes' in rawEmotes) {
                // From an emote set (like "global")
                for (const data of rawEmotes.emotes) {
                    this._cacheSevenTVEmote(channel, data.data, format);
                }
            } else {
                // From users
                for (const data of rawEmotes.emote_set.emotes) {
                    this._cacheSevenTVEmote(channel, data.data, format);
                }
            }

            return this.channels.get(channel).emotes.filter(e => e.type === '7tv');
        });
    }

    /**
     * Converts emote JSONs to emotes
     * @param {Object} [json] - Emote JSON
     * @returns {Emote[]}
     */
    fromJSON(json) {
        const emotes = [];
        const classMap = {
            bttv: { class: BTTVEmote, cache: (emoteJSON, channel_id, existing_emote) => this._cacheBTTVEmote(channel_id, null, existing_emote) },
            ffz: { class: FFZEmote, cache: (emoteJSON, channel_id, existing_emote) => this._cacheFFZEmote(channel_id, null, existing_emote) },
            '7tv': { class: SevenTVEmote, cache: (emoteJSON, channel_id, existing_emote) => this._cacheSevenTVEmote(channel_id, null, emoteJSON.imageType, existing_emote) },
            twitch: { class: TwitchEmote, cache: (emoteJSON, channel_id, existing_emote) => this._cacheTwitchEmote(channel_id, null, existing_emote) }
        };
        for (const emoteJSON of json) {
            const { type } = emoteJSON;
            const emoteClass = classMap[type].class;

            if (!emoteClass) {
                console.log(`Unknown type: ${type}`);
                continue;
            }

            this._setupChannel(emoteJSON.channel_id, type === '7tv' ? emoteJSON.imageType : null);
            const emote = emoteClass.fromJSON(emoteJSON, this.channels.get(emoteJSON.channel_id));
            classMap[type].cache(emoteJSON, emoteJSON.channel_id, emote);
            emotes.push(emote);
        }
        return emotes;
    }

    /**
     * Sets up a channel
     * @private
     * @param {int} channel_id - ID of the channel.
     * @param {string} [format=null] - The type file format to use (webp/avif).
     * @returns {Channel}
     */
    _setupChannel(channel_id, format = null) {
        let channel = this.channels.get(channel_id);
        if (!channel) {
            channel = new Channel(this, channel_id);
            this.channels.set(channel_id, channel);
        }
        if (format) channel.format = format;
        return channel;
    }
}

module.exports = EmoteFetcher;
