const _ = require('lodash');
const request = require('superagent');

const TWITCH_EMOTES = 'https://twitchemotes.com/api_cache/v2/images.json';
const LINK_TEMPLATE = [
    'https://static-cdn.jtvnw.net/emoticons/v1/{imageID}/1.0',
    'https://static-cdn.jtvnw.net/emoticons/v1/{imageID}/2.0',
    'https://static-cdn.jtvnw.net/emoticons/v1/{imageID}/3.0'
];

const BTTV_EMOTES = 'https://api.betterttv.net/2/emotes';
const BTTV_CHANNELS = 'https://api.betterttv.net/2/channels/{channelName}';
const BTTV_TEMPLATE = [
    'https://cdn.betterttv.net/emote/{imageID}/1x',
    'https://cdn.betterttv.net/emote/{imageID}/2x',
    'https://cdn.betterttv.net/emote/{imageID}/3x'
];

/** For use in parsing, a big regex. */
const PUNCTUATIONS = "([\\w\\d]+)|(\\s)|([\\$\\uFFE5\\^\\+=`~<>{}\\[\\]|\\u3000-\\u303F!-#%-\\x2A,-\\/:;\\x3F@\\x5B-\\x5D_\\x7B}\\u00A1\\u00A7\\u00AB\\u00B6\\u00B7\\u00BB\\u00BF\\u037E\\u0387\\u055A-\\u055F\\u0589\\u058A\\u05BE\\u05C0\\u05C3\\u05C6\\u05F3\\u05F4\\u0609\\u060A\\u060C\\u060D\\u061B\\u061E\\u061F\\u066A-\\u066D\\u06D4\\u0700-\\u070D\\u07F7-\\u07F9\\u0830-\\u083E\\u085E\\u0964\\u0965\\u0970\\u0AF0\\u0DF4\\u0E4F\\u0E5A\\u0E5B\\u0F04-\\u0F12\\u0F14\\u0F3A-\\u0F3D\\u0F85\\u0FD0-\\u0FD4\\u0FD9\\u0FDA\\u104A-\\u104F\\u10FB\\u1360-\\u1368\\u1400\\u166D\\u166E\\u169B\\u169C\\u16EB-\\u16ED\\u1735\\u1736\\u17D4-\\u17D6\\u17D8-\\u17DA\\u1800-\\u180A\\u1944\\u1945\\u1A1E\\u1A1F\\u1AA0-\\u1AA6\\u1AA8-\\u1AAD\\u1B5A-\\u1B60\\u1BFC-\\u1BFF\\u1C3B-\\u1C3F\\u1C7E\\u1C7F\\u1CC0-\\u1CC7\\u1CD3\\u2010-\\u2027\\u2030-\\u2043\\u2045-\\u2051\\u2053-\\u205E\\u207D\\u207E\\u208D\\u208E\\u2329\\u232A\\u2768-\\u2775\\u27C5\\u27C6\\u27E6-\\u27EF\\u2983-\\u2998\\u29D8-\\u29DB\\u29FC\\u29FD\\u2CF9-\\u2CFC\\u2CFE\\u2CFF\\u2D70\\u2E00-\\u2E2E\\u2E30-\\u2E3B\\u3001-\\u3003\\u3008-\\u3011\\u3014-\\u301F\\u3030\\u303D\\u30A0\\u30FB\\uA4FE\\uA4FF\\uA60D-\\uA60F\\uA673\\uA67E\\uA6F2-\\uA6F7\\uA874-\\uA877\\uA8CE\\uA8CF\\uA8F8-\\uA8FA\\uA92E\\uA92F\\uA95F\\uA9C1-\\uA9CD\\uA9DE\\uA9DF\\uAA5C-\\uAA5F\\uAADE\\uAADF\\uAAF0\\uAAF1\\uABEB\\uFD3E\\uFD3F\\uFE10-\\uFE19\\uFE30-\\uFE52\\uFE54-\\uFE61\\uFE63\\uFE68\\uFE6A\\uFE6B\\uFF01-\\uFF03\\uFF05-\\uFF0A\\uFF0C-\\uFF0F\\uFF1A\\uFF1B\\uFF1F\\uFF20\\uFF3B-\\uFF3D\\uFF3F\\uFF5B\\uFF5D\\uFF5F-\\uFF65])+";

/** Template for parse format. */
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
    constructor(id, name, channel, bttv = false, gif = false){
        /** ID of the emote. */
        this.id = id;

        /** Name of the emote. */
        this.name = name;

        /** Channel this emote belongs to. */
        this.channel = channel;

        /** If this is a BTTV emote. */
        this.bttv = bttv;

        /** If this emote is a GIF. */
        this.gif = gif;
    }

    /** 
     * Gets the image link for this emote.
     * @param size - Image size, 0 to 2, default 0.
     * @return String link to emote image.
     */
    toLink(size = 0){
        if (this.bttv) return (BTTV_TEMPLATE[size] || BTTV_TEMPLATE[0]).replace('{imageID}', this.id);
        return (LINK_TEMPLATE[size] || LINK_TEMPLATE[0]).replace('{imageID}', this.id);
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

/** Gets all emotes from Twitch. */
function getEmoteList(){
    return new Promise((resolve, reject) => {
        request(TWITCH_EMOTES).end((err, res) => {
            if (err) return reject(err);
            resolve(res.body.images);
        });
    });
}

/** Gets emotes from BTTV. */
function getBTTVEmoteList(channelName){
    return new Promise((resolve, reject) => {
        request(channelName ? BTTV_CHANNELS.replace('{channelName}', channelName) : BTTV_EMOTES).end((err, res) => {
            if (err) return reject(err);
            if (!res.body.emotes) return reject('Channel "' + channelName + '" not found.');
            resolve(res.body.emotes);
        });
    });
}

/** Adds a channel and its emotes. */
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
            if (_.size(channelEmotes) === 0) return reject('Channel "' + channelName + '" not found.');

            let channel = channels.get(channelName ? channelName : TWITCH_GLOBAL) || new Channel(channelName ? channelName : TWITCH_GLOBAL);
            let emotes = channel.emotes || new Map();

            _.forEach(channelEmotes, (val, key) => {
                let emote = new Emote(key, val.code, channel);
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
                if (_.size(channelEmotes) === 0) return reject('Channel "' + channelName + '" not found.');

                let channel = channels.get(channelName ? channelName : TWITCH_GLOBAL) || new Channel(channelName ? channelName : TWITCH_GLOBAL);
                let emotes = channel.emotes || new Map();

                _.forEach(channelEmotes, (val, key) => {
                    let emote = new Emote(key, val.code, channel);
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
                    emotes.set(emote.code, new Emote(emote.id, emote.code, BTTV_GLOBAL, true, emote.imageType === 'gif'));
                });

                channel.emotes = emotes;
                addChannel(channel);
                resolve(channel);
            } else {
                emoteRes.forEach(emote => {
                    emotes.set(emote.code, new Emote(emote.id, emote.code, null, true, emote.imageType === 'gif'));
                    bttv.set(emote.code, new Emote(emote.id, emote.code, null, true, emote.imageType === 'gif'));
                });

                channel.emotes = emotes;
                addChannel(channel, true);
                resolve(channel);
            }
        }).catch(reject);
    });
}

/** 
 * Loads the channel that the emote belongs to, Twitch and global BTTV only.
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
                    if (!emote) reject('Emote ' + emoteName + ' not found.');

                   loadBTTVChannel().then(c => resolve(c.emotes.get(emoteName))).catch(reject);
                }).catch(reject);
            }

            let channelEmotes = _.pickBy(emoteRes, (val, key) => val.channel === emote.channel);

            let channelName = channelEmotes[Object.keys(channelEmotes)[0]].channel;
            let channel = channels.get(channelName ? channelName : TWITCH_GLOBAL) || new Channel(channelName ? channelName : TWITCH_GLOBAL);
            let emotes = channel.emotes || new Map();

            _.forEach(channelEmotes, (val, key) => {
                let emote = new Emote(key, val.code, channel);
                emotes.set(emote.name, emote);
            });

            channel.emotes = emotes;
            addChannel(channel);

            if (channel.name === TWITCH_GLOBAL) resolve(channel.emotes.get(emoteName));
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

        Promise.all([twitch, bttv].map(p => p.catch(e => e))).then(() => channels.has(name) ? resolve(channels.get(name)) : reject('Channel "' + channelName + '" not found.')).catch(reject);
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
                
                return loadByEmote(emoteName).then(resolve);
            }
        
            let emoteObj = emotes.get(emoteName);
            let bttvObj = bttv.get(emoteName);
            if (emoteObj || bttvObj) return resolve(emoteObj || bttvObj);

            return channel(channelName).then(() => resolve(emote(emoteName))).catch(reject);
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
 * @param start - Opening character.
 * @param end - Closing character.
 * @return The formatted string.
 */
function parse(text, type = 'html', size = 0, start = '', end = start){
    if (!/html|markdown|bbcode/i.test(type)) type = 'html';
    if (size < 0 || size > 2) size = 0;

    let reg = new RegExp('(\\' + start + '[\\w\\d\\(\\)]+\\' + end + ')|' + PUNCTUATIONS, 'g');
    let words = text.match(reg);
    let emotes = [];

    console.log(words);

    let emoteReg = new RegExp('(\\' + start + '[\\w\\d\\(\\)]+\\' + end + ')', 'g');
    let limitReg = new RegExp('^\\' + start + '|\\' + end + '$', 'g');

    words.forEach(w => {
        if (emoteReg.test(w)){
            let emote = getEmote(w.replace(limitReg, ''));
            return emotes.push(emote);
        }

        emotes.push('');
    });

    let template = FORMAT_TEMPLATE[type.toUpperCase()];
    return words.map((w, i) => emotes[i] instanceof Emote ? template.replace(/{size}/g, size).replace(/{name}/g, emotes[i].name).replace(/{link}/g, emotes[i].toLink(size)) : w).join('');
}

/**
 * Parses text into one with the emotes formatted in. This can take a long time, as all words are checked.
 * @param text - Text to parse.
 * @param type - One of: 'html', 'markdown', or 'bbcode'.
 * @param size - Image size, 0 to 2, default 0.
 * @param start - Opening character.
 * @param end - Closing character.
 * @return Promise containing formatted string.
 */
function parseAll(text, type = 'html', size = 0, start = '', end = start){
    if (!/html|markdown|bbcode/i.test(type)) type = 'html';
    if (size < 0 || size > 2) size = 0;

    return new Promise((resolve, reject) => {
        let reg = new RegExp('(\\' + start + '[\\w\\d\\(\\)]+\\' + end + ')|' + PUNCTUATIONS, 'g');
        let words = text.match(reg);
        let promises = [];

        let emoteReg = new RegExp('(\\' + start + '[\\w\\d\\(\\)]+\\' + end + ')', 'g');
        let limitReg = new RegExp('^\\' + start + '|\\' + end + '$', 'g');

        words.forEach(w => {
            if (emoteReg.test(w)){
                let emotePromise = emote(w.replace(limitReg, ''));
                return promises.push(emotePromise);
            }

            promises.push(Promise.resolve(''));
        });

        Promise.all(promises.map(p => p.catch(e => e))).then(emotes => {
            let template = FORMAT_TEMPLATE[type.toUpperCase()];
            resolve(words.map((w, i) => emotes[i] instanceof Emote ? template.replace(/{size}/g, size).replace(/{name}/g, emotes[i].name).replace(/{link}/g, emotes[i].toLink(size)) : w).join(''));
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
    clearCache,
    parse, parseAll
};