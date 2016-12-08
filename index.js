const _ = require('lodash');
const request = require('superagent');

const TWITCH_EMOTES = 'https://twitchemotes.com/api_cache/v2/images.json';
const LINK_TEMPLATE = {
    SMALL: 'https://static-cdn.jtvnw.net/emoticons/v1/{imageID}/1.0',
    MEDIUM: 'https://static-cdn.jtvnw.net/emoticons/v1/{imageID}/2.0',
    LARGE: 'https://static-cdn.jtvnw.net/emoticons/v1/{imageID}/3.0'
};

const BTTV_EMOTES = 'https://api.betterttv.net/2/emotes';
const BTTV_CHANNELS = 'https://api.betterttv.net/2/channels/{channelName}';
const BTTV_TEMPLATE = {
    SMALL: 'https://cdn.betterttv.net/emote/{imageID}/1x',
    MEDIUM: 'https://cdn.betterttv.net/emote/{imageID}/2x',
    LARGE: 'https://cdn.betterttv.net/emote/{imageID}/3x'
};

const FORMAT_TEMPLATE = {
    HTML: '<img class="twitch-emote twitch-emote-{size} src={link}">',
    MARKDOWN: '![{name}]({link} "{name}")',
    BBCODE: '[img]{link}[/img]'
};

/** Channel name for global Twitch emotes. */
const TWITCH_GLOBAL = 'GLOBAL/TWITCH';

/** Channel name for global BTTV emotes. */
const BTTV_GLOBAL = 'GLOBAL/BTTV';

/** A Twitch channel. */
class Channel {
    constructor(name, emotes){
        /** Name of the Twitch channel. */
        this.name = name;

        /** Emotes belonging to this channel. */
        this.emotes = emotes;
    }
}

/** An emote. */
class Emote {
    constructor(id, name, channel, bttv){
        /** ID of the emote. */
        this.id = id;

        /** Name of the emote. */
        this.name = name;

        /** Channel this emote belongs to. */
        this.channel = channel;

        /** If this is a BTTV emote. */
        this.bttv = bttv;
    }

    /** 
     * Gets the image link for this emote.
     * @param size - Image size, 0 to 2, default 0.
     * @return String link to emote image.
     */
    toLink(size = 0){
        if (this.bttv){
            if (size === 1) return BTTV_TEMPLATE.MEDIUM.replace('{imageID}', this.id);
            if (size === 2) return BTTV_TEMPLATE.LARGE.replace('{imageID}', this.id);
            return BTTV_TEMPLATE.SMALL.replace('{imageID}', this.id);
        }

        if (size === 1) return LINK_TEMPLATE.MEDIUM.replace('{imageID}', this.id);
        if (size === 2) return LINK_TEMPLATE.LARGE.replace('{imageID}', this.id);
        return LINK_TEMPLATE.SMALL.replace('{imageID}', this.id);
    }

    toString(){
        return this.toLink(0);
    }
}

/** Cached channels. */
let channels = new Map();

/** Cached emotes. */
let emotes = new Map();

/** Cached BTTV emotes. */
let bttv = new Map();

function getEmoteList(){
    return new Promise((resolve, reject) => {
        request(TWITCH_EMOTES).end((err, res) => {
            if (err) return reject(err);
            resolve(res.body.images);
        });
    });
}

function getBTTVEmoteList(channelName){
    return new Promise((resolve, reject) => {
        request(channelName ? BTTV_CHANNELS.replace('{channelName}', channelName) : BTTV_EMOTES).end((err, res) => {
            if (err) return reject(err);
            resolve(res.body.emotes);
        });
    });
}

function addChannel(channel, bttv){
    channels.set(channel.name, channel);
    if (!bttv) channel.emotes.forEach(e => emotes.set(e.name, e));
}

/** 
 * Loads a channel and its emotes.
 * @param channelName - Name of channel, keep as null for global emotes.
 * @return Promise containing channel.
 */
function loadChannel(channelName){
    return new Promise((resolve, reject) => {
        getEmoteList().then(emoteRes => {
            let channelEmotes = _.pickBy(emoteRes, (val, key) => val.channel === channelName);
            if (channelEmotes.length === 0) reject('Channel not found.');

            let channel = channels.get(channelName ? channelName : TWITCH_GLOBAL) || new Channel(channelName ? channelName : TWITCH_GLOBAL);
            let emotes = channel.emotes || new Map();

            _.forEach(channelEmotes, (val, key) => {
                let emote = new Emote(key, val.code, channel, false);
                emotes.set(emote.name, emote);
            });

            channel.emotes = emotes;
            addChannel(channel);

            resolve(channel);
        }).catch(reject);
    });
}

/** 
 * Loads multiple channels and their emotes. 
 * @param channelNames - Array of channel names.
 * @return Promise containing Array of channels.
 */
function loadChannels(channelNames){
    return new Promise((resolve, reject) => {
        getEmoteList().then(emoteRes => {
            let channels = [];

            channelNames.forEach(channelName => {
                let channelEmotes = _.pickBy(emoteRes, (val, key) => val.channel === channelName);
                if (_.size(channelEmotes) === 0) reject('Channel not found.');

                let channel = channels.get(channelName ? channelName : TWITCH_GLOBAL) || new Channel(channelName ? channelName : TWITCH_GLOBAL);
                let emotes = channel.emotes || new Map();

                _.forEach(channelEmotes, (val, key) => {
                    let emote = new Emote(key, val.code, channel, false);
                    emotes.set(emote.name, emote);
                });

                channel.emotes = emotes;
                addChannel(channel);
                channels.push(channel);
            });

            resolve(channels);
        }).catch(reject);
    });
}

/** 
 * Loads a Twitch channel's BTTV emotes.
 * @param channelName - Name of channel, keep as null for global emotes.
 * @return Promise containing channel.
 */
function loadBTTVChannel(channelName){
    return new Promise((resolve, reject) => {
        getBTTVEmoteList(channelName).then(emoteRes => {
            let channel = channels.get(channelName ? channelName : BTTV_GLOBAL) || new Channel(channelName ? channelName : BTTV_GLOBAL);
            let emotes = channel.emotes || new Map();

            if (channel.name === BTTV_GLOBAL){
                emoteRes.forEach(emote => {
                    emotes.set(emote.code, new Emote(emote.id, emote.code, BTTV_GLOBAL, true));
                });

                channel.emotes = emotes;
                addChannel(channel);
                resolve(channel);
            } else {
                emoteRes.forEach(emote => {
                    emotes.set(emote.code, new Emote(emote.id, emote.code, null, true));
                    bttv.set(emote.code, new Emote(emote.id, emote.code, null, true));
                });

                channel.emotes = emotes;
                addChannel(channel, true);
                resolve(channel);
            }
        }).catch(reject);
    });
}

/** 
 * Loads the channel that the emote belongs to, Twitch only.
 * @param emoteName - Name of emote.
 * @return Promise containing emote.
 */
function loadByEmote(emoteName){
    return new Promise((resolve, reject) => {
        getEmoteList().then(emoteRes => {
            let emote = _.find(emoteRes, (obj) => obj.code === emoteName);

            if (_.size(emote) === 0){
                return getBTTVEmoteList().then(bttvRes => {
                    let emote = bttvRes.find(e => e.code === emoteName);
                    if (emote.length === 0) reject('Emote not found.');

                   loadBTTVChannel().then(c => resolve(c.emotes.get(emoteName))).catch(reject);
                }).catch(reject);
            }

            let channelEmotes = _.pickBy(emoteRes, (val, key) => val.channel === emote.channel);

            let channelName = channelEmotes[Object.keys(channelEmotes)[0]].channel;
            let channel = channels.get(channelName ? channelName : TWITCH_GLOBAL) || new Channel(channelName ? channelName : TWITCH_GLOBAL);
            let emotes = channel.emotes || new Map();

            _.forEach(channelEmotes, (val, key) => {
                let emote = new Emote(key, val.code, channel, false);
                emotes.set(emote.name, emote);
            });

            channel.emotes = emotes;
            addChannel(channel);
            loadBTTVChannel(channel.name).then(() => resolve(channel.emotes.get(emoteName))).catch(reject);
        }).catch(reject);
    });
}

/** 
 * Get Twitch channel by name. Twitch and global BTTV emotes only.
 * @param name - Name of channel.
 * @return Promise containing channel.
 */
function channel(name){
    return new Promise((resolve, reject) => {
        let channelObj = channels.get(name ? name : TWITCH_GLOBAL);
        if (channelObj) return resolve(channelObj);

        let twitch = loadChannel(name);
        let bttv = loadBTTVChannel(name);

        Promise.all([twitch, bttv]).then(() => resolve(channels.get(name))).catch(reject);
    });
}

/** 
 * Get Twitch channel by name, as long as it is in the cache. Twitch and global BTTV emotes only.
 * @param name - Name of channel.
 * @return Channel object.
 */
function getChannel(name){
    let channelObj = channels.get(name ? name : TWITCH_GLOBAL);
    return channelObj;
}

/** 
 * Get emote by name.
 * @param name - Name of emote.
 * @param Promise containing emote.
 */
function emote(name){
    return new Promise((resolve, reject) => {
        let emoteObj = emotes.get(name);
        let bttvObj = bttv.get(name);
        if (emoteObj || bttvObj) return resolve(emoteObj || bttvObj);

        if (/:/.test(name)){
            let channelName = name.split(':')[0];
            let emoteName = name.split(':')[1];

            if (channelName === TWITCH_GLOBAL || channelName === BTTV_GLOBAL || channelName.length === 0){
                let emoteObj = emotes.get(emoteName);
                if (emoteObj) return resolve(emoteObj);
                
                return loadByEmote(emote).then(resolve);
            }
        
            let emoteObj = emotes.get(emoteName);
            let bttvObj = bttv.get(emoteName);
            if (emoteObj || bttvObj) return resolve(emoteObj || bttvObj);

            return loadBTTVChannel(channelName === BTTV_GLOBAL ? null : channelName).then(() => resolve(emote(emoteName))).catch(reject);
        }

        loadByEmote(name).then(resolve).catch((reject));
    });
}

/** 
 * Get emote by name, as long as it is in the cache.
 * @param name - Name of emote.
 * @param Emote object.
 */
function getEmote(name){
    let emoteObj = emotes.get(name);
    let bttvObj = bttv.get(name);
    if (emoteObj || bttvObj) return (emoteObj || bttvObj);

    if (/:/.test(name)){
        let channel = name.split(':')[0];
        let emote = name.split(':')[1];

        if (channel === TWITCH_GLOBAL || channel === BTTV_GLOBAL || channel.length === 0){
            let emoteObj = emotes.get(emote);
            return emoteObj;
        }
    
        let emoteObj = emotes.get(emote);
        let bttvObj = bttv.get(emote);

        return (emoteObj || bttvObj);
    }
}

/**
 * Parses text into one with the emotes formatted in. Emotes are only parsed if they are cached.
 * @param text - Text to parse.
 * @param type - One of: 'html', 'markdown', or 'bbcode'.
 * @param size - Image size, 0 to 2, default 0.
 * @return The formatted string.
 */
function parse(text, type = 'html', size = 0){
    if (!/html|markdown|bbcode/i.test(type)) type = 'html';
    if (size < 0 || size > 2) size = 0;

    let words = text.split(/\s/);
    let emotes = [];

    words.forEach(w => {
        let emote = getEmote(w);
        emotes.push(emote);
    });

    let template = FORMAT_TEMPLATE[type.toUpperCase()];
    return words.map((w, i) => emotes[i] instanceof Emote ? template.replace(/{size}/g, size).replace(/{name}/g, emotes[i].name).replace(/{link}/g, emotes[i].toLink(size)) : w).join(' ');
}

/**
 * Parses text into one with the emotes formatted in. This can take a long time, as all words (separated by whitespace) are checked.
 * @param text - Text to parse.
 * @param type - One of: 'html', 'markdown', or 'bbcode'.
 * @param size - Image size, 0 to 2, default 0.
 * @return Promise containing formatted string.
 */
function parseAll(text, type = 'html', size = 0){
    if (!/html|markdown|bbcode/i.test(type)) type = 'html';
    if (size < 0 || size > 2) size = 0;

    return new Promise((resolve, reject) => {
        let words = text.split(/\s/);
        let promises = [];

        words.forEach(w => {
            let emotePromise = emote(w);
            promises.push(emotePromise);
        });

        Promise.all(promises.map(p => p.catch(e => e))).then(emotes => {
            let template = FORMAT_TEMPLATE[type.toUpperCase()];
            resolve(words.map((w, i) => emotes[i] instanceof Emote ? template.replace(/{size}/g, size).replace(/{name}/g, emotes[i].name).replace(/{link}/g, emotes[i].toLink(size)) : w).join(' '));
        }).catch(reject);
    });
}

/** Clears the cache. */
function clearCache(){
    channels.clear();
    emotes.clear();
    bttv.clear();
}

module.exports = {
    channel, emote, getChannel, getEmote,
    TWITCH_GLOBAL, loadChannel, loadChannels,
    BTTV_GLOBAL, loadBTTVChannel,
    loadByEmote,
    clearCache,
    parse, parseAll
};