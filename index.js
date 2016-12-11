const _ = require('lodash');
const request = require('superagent');

/** Link to Twitch Emotes API. */
const TWITCH_EMOTES = 'https://twitchemotes.com/api_cache/v2/images.json';

/** Image template for Twitch emotes. */
const LINK_TEMPLATE = [
    'https://static-cdn.jtvnw.net/emoticons/v1/{imageID}/1.0',
    'https://static-cdn.jtvnw.net/emoticons/v1/{imageID}/2.0',
    'https://static-cdn.jtvnw.net/emoticons/v1/{imageID}/3.0'
];

/** Link to BTTV global emotes. */
const BTTV_EMOTES = 'https://api.betterttv.net/2/emotes';

/** Link to BTTV channels. */
const BTTV_CHANNELS = 'https://api.betterttv.net/2/channels/{channelName}';

/** Image template for BTTV emotes. */
const BTTV_TEMPLATE = [
    'https://cdn.betterttv.net/emote/{imageID}/1x',
    'https://cdn.betterttv.net/emote/{imageID}/2x',
    'https://cdn.betterttv.net/emote/{imageID}/3x'
];

/** For use in parsing, a big regex. */
const PUNCTUATIONS = '([\\w\\d]+)|(\\s)|([\\$\\uFFE5\\^\\+=`~<>{}\\[\\]|\\u3000-\\u303F!-#%-\\x2A,-\\/:;\\x3F@\\x5B-\\x5D_\\x7B}\\u00A1\\u00A7\\u00AB\\u00B6\\u00B7\\u00BB\\u00BF\\u037E\\u0387\\u055A-\\u055F\\u0589\\u058A\\u05BE\\u05C0\\u05C3\\u05C6\\u05F3\\u05F4\\u0609\\u060A\\u060C\\u060D\\u061B\\u061E\\u061F\\u066A-\\u066D\\u06D4\\u0700-\\u070D\\u07F7-\\u07F9\\u0830-\\u083E\\u085E\\u0964\\u0965\\u0970\\u0AF0\\u0DF4\\u0E4F\\u0E5A\\u0E5B\\u0F04-\\u0F12\\u0F14\\u0F3A-\\u0F3D\\u0F85\\u0FD0-\\u0FD4\\u0FD9\\u0FDA\\u104A-\\u104F\\u10FB\\u1360-\\u1368\\u1400\\u166D\\u166E\\u169B\\u169C\\u16EB-\\u16ED\\u1735\\u1736\\u17D4-\\u17D6\\u17D8-\\u17DA\\u1800-\\u180A\\u1944\\u1945\\u1A1E\\u1A1F\\u1AA0-\\u1AA6\\u1AA8-\\u1AAD\\u1B5A-\\u1B60\\u1BFC-\\u1BFF\\u1C3B-\\u1C3F\\u1C7E\\u1C7F\\u1CC0-\\u1CC7\\u1CD3\\u2010-\\u2027\\u2030-\\u2043\\u2045-\\u2051\\u2053-\\u205E\\u207D\\u207E\\u208D\\u208E\\u2329\\u232A\\u2768-\\u2775\\u27C5\\u27C6\\u27E6-\\u27EF\\u2983-\\u2998\\u29D8-\\u29DB\\u29FC\\u29FD\\u2CF9-\\u2CFC\\u2CFE\\u2CFF\\u2D70\\u2E00-\\u2E2E\\u2E30-\\u2E3B\\u3001-\\u3003\\u3008-\\u3011\\u3014-\\u301F\\u3030\\u303D\\u30A0\\u30FB\\uA4FE\\uA4FF\\uA60D-\\uA60F\\uA673\\uA67E\\uA6F2-\\uA6F7\\uA874-\\uA877\\uA8CE\\uA8CF\\uA8F8-\\uA8FA\\uA92E\\uA92F\\uA95F\\uA9C1-\\uA9CD\\uA9DE\\uA9DF\\uAA5C-\\uAA5F\\uAADE\\uAADF\\uAAF0\\uAAF1\\uABEB\\uFD3E\\uFD3F\\uFE10-\\uFE19\\uFE30-\\uFE52\\uFE54-\\uFE61\\uFE63\\uFE68\\uFE6A\\uFE6B\\uFF01-\\uFF03\\uFF05-\\uFF0A\\uFF0C-\\uFF0F\\uFF1A\\uFF1B\\uFF1F\\uFF20\\uFF3B-\\uFF3D\\uFF3F\\uFF5B\\uFF5D\\uFF5F-\\uFF65])+';

/** Template for parse formats. */
const FORMAT_TEMPLATE = {
    HTML: '<img class="twitch-emote twitch-emote-{size} src={link}">',
    MARKDOWN: '![{name}]({link} "{name}")',
    BBCODE: '[img]{link}[/img]',
    PLAIN: '{link}'
};

/** Channel name for global Twitch emotes. */
const TWITCH_GLOBAL = 'global/twitch';

/** Channel name for global BTTV emotes. */
const BTTV_GLOBAL = 'global/bttv';

/** Utility class. Extends Map. */
class Cache extends Map {
    /**
     * Creates a new Cache.
     * @param iterable - An iterable.
     */
    constructor(iterable){
        super(iterable);
    }

    /**
     * Finds first matching value by property or function.
     * @param propOrFunc - Property or function to test.
     * @param value - Value to find.
     * @return The first match.
     */
    find(propOrFunc, value){
        if (typeof propOrFunc === 'string'){
            if (typeof value === 'undefined') return null;

            for (const item of this.values()){
                if (item[propOrFunc] === value) return item;
            }

            return null;
        }

        if (typeof propOrFunc === 'function'){
            for (const [key, val] of this){
                if (propOrFunc(val, key, this)) return val;
            }

            return null;
        }

        return null;
    }

    /**
     * Filters cache by function.
     * @param func - Function to test.
     * @return Cache containing matches.
     */
    filter(func, thisArg){
        if (thisArg) func = func.bind(thisArg);

        const results = new Cache();

        for (const [key, val] of this) {
            if (func(val, key, this)) results.set(key, val);
        }

        return results;
    }

    /**
     * Maps cache by function.
     * @param func - Function to use.
     * @return Array containing results.
     */
    map(func, thisArg){
        if (thisArg) func = func.bind(thisArg);

        const array = new Array(this.size);
        let i = 0;

        for (const [key, val] of this) array[i++] = func(val, key, this);
        return array;
    }
}

/** A Twitch channel. */
class Channel {
    /**
     * Creates a new Channel.
     * @param name - Name of channel.
     * @param emotes - Caches of emotes.
     */
    constructor(name, emotes = new Cache()){
        /** Name of the Twitch channel. */
        this.name = name;

        /** Emotes belonging to this channel. */
        this.emotes = emotes;
    }

    /** Same as name property. */
    toString(){
        return this.name;
    }
}

/** An emote. */
class Emote {
    /**
     * Creates a new Emote.
     * @param id - ID of emote.
     * @param name - Name of emote.
     * @param channel - Channel this emote belongs to.
     * @param set - Set this emote belongs to.
     * @param description - Description of emote.
     * @param bttv - If this emote is BTTV.
     * @param gif - If this emote is a GIF.
     */
    constructor(id, name, channel, set, description, bttv = false, gif = false){
        /** ID of the emote. */
        this.id = id;

        /** Name of the emote. */
        this.name = name;

        /** Channel this emote belongs to. Null for non-global BTTV emotes. */
        this.channel = channel;

        /** Set ID of the emote. For BTTV emotes, this would be the original channel's name. */
        this.set = set;

        /** Description of the emote. Only available for Twitch global emotes. */
        this.description = description;

        /** If this is a BTTV emote. */
        this.bttv = bttv;

        /** If this emote is a GIF. */
        this.gif = gif;
    }

    /**
     * Gets the image link for this emote.
     * @param size - Image size, 0 to 2, default 0.
     * @return Link to emote image.
     */
    toLink(size = 0){
        if (this.bttv) return (BTTV_TEMPLATE[size] || BTTV_TEMPLATE[0]).replace('{imageID}', this.id);
        return (LINK_TEMPLATE[size] || LINK_TEMPLATE[0]).replace('{imageID}', this.id);
    }

    /** Same as name property. */
    toString(){
        return this.name;
    }
}

/** Cached channels. */
let channels = new Cache();

/** Cached emotes. */
let emotes = new Cache();

/** Cached BTTV emotes. */
let bttv = new Cache();

/**
 * Gets all emotes from Twitch Emotes.
 * @return All emotes data.
 */
function getEmoteList(){
    return new Promise((resolve, reject) => {
        request(TWITCH_EMOTES).end((err, res) => {
            if (err) return reject(err);
            resolve(res.body.images);
        });
    });
}

/**
 * Gets emotes from BTTV.
 * @param channelName - Name of channel.
 * @return BTTV channel data.
 */
function getBTTVEmoteList(channelName){
    return new Promise((resolve, reject) => {
        let name = channelName ? BTTV_CHANNELS.replace('{channelName}', channelName) : BTTV_EMOTES;

        request(name).end((err, res) => {
            if (err) return reject(err);
            if (!res.body.emotes) return reject('Channel "' + channelName + '" not found.');
            resolve(res.body.emotes);
        });
    });
}

/**
 * Adds a channel and its emotes.
 * @param channel - Channel object.
 * @param bttv - If this channel is BTTV.
 */
function addChannel(channel, bttv){
    channels.set(channel.name, channel);

    // Only adds if it's not BTTV non-global emotes, because BTTV emotes can be in more than one channel.
    if (!bttv) channel.emotes.forEach(e => emotes.set(e.name, e));
}

/**
 * Parses and caches data.
 * @param data - Data of emotes.
 * @param channelName - Name of channel to cache.
 * @return Channel cached.
 */
function cacheChannelData(data, channelName){
    // Defaults to global Twitch.
    let channel = channels.get(channelName || TWITCH_GLOBAL) || new Channel(channelName || TWITCH_GLOBAL);

    _.forEach(data, (val, key) => {
        let emote = new Emote(key, val.code, channel, val.set, val.description ? val.description : null);
        channel.emotes.set(emote.name, emote);
    });

    addChannel(channel);
    return channel;
}

/**
 * Loads a channel and its emotes.
 * @param channelName - Name of channel, keep as null for global emotes.
 * @return Promise containing channel.
 */
function loadChannel(channelName){
    return new Promise((resolve, reject) => {
        // Lowercase channel names.
        let name = channelName ? channelName.toLowerCase() : null;

        getEmoteList().then(emoteRes => {
            let channelEmotes = _.pickBy(emoteRes, val => val.channel === name);
            if (_.size(channelEmotes) === 0) return reject('Channel "' + name + '" not found.');

            let channel = cacheChannelData(channelEmotes, name);
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
        if (channelNames.length === 0) return reject('Channel names must be defined.');
        let names = new Set(channelNames);

        getEmoteList().then(emoteRes => {
            let finishedChannels = [];

            names.forEach(channelName => {
                // Lowercase channel names.
                let name = channelName ? channelName.toLowerCase() : null;

                let channelEmotes = _.pickBy(emoteRes, val => val.channel === name);
                if (_.size(channelEmotes) === 0) return reject('Channel "' + name + '" not found.');

                let channel = cacheChannelData(channelEmotes, name);
                finishedChannels.push(channel);
            });

            resolve(finishedChannels);
        }).catch(reject);
    });
}

/**
 * Loads all Twitch channels. Takes a long time.
 * @return Promise containing Array of channels.
 */
function loadAllChannels(){
    return new Promise((resolve, reject) => {
        getEmoteList().then(emoteRes => {
            let emotesByChannel = _.groupBy(emoteRes, obj => obj.channel);
            let channelNames = [];

            _.forEach(emotesByChannel, val => channelNames.push(val[0].channel));

            let finishedChannels = [];

            channelNames.forEach(channelName => {
                let channelEmotes = _.pickBy(emoteRes, val => val.channel === channelName);
                if (_.size(channelEmotes) === 0) return reject('Channel "' + channelName + '" not found.');

                let channel = cacheChannelData(channelEmotes, channelName);
                finishedChannels.push(channel);
            });

            resolve(finishedChannels);
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
        // Lowercase channel names.
        let name = channelName ? channelName.toLowerCase() : null;

        getBTTVEmoteList(name).then(emoteRes => {
            // Defaults to global BTTV.
            let channel = channels.get(name || BTTV_GLOBAL) || new Channel(name || BTTV_GLOBAL);

            if (channel.name === BTTV_GLOBAL){
                emoteRes.forEach(emote => {
                    let e = new Emote(emote.id, emote.code, BTTV_GLOBAL, emote.channel, null, true, emote.imageType === 'gif');
                    channel.emotes.set(emote.code, e);
                });

                addChannel(channel);
                return resolve(channel);
            }

            emoteRes.forEach(emote => {
                let e = new Emote(emote.id, emote.code, null, emote.channel, null, true, emote.imageType === 'gif');
                channel.emotes.set(emote.code, e);
                bttv.set(emote.code, e);
            });

            addChannel(channel, true);
            resolve(channel);
        }).catch(reject);
    });
}

/**
 * Loads multiple BTTV channels and their emotes.
 * @param channelNames - Array of channel names.
 * @return Promise containing Array of channels.
 */
function loadBTTVChannels(channelNames){
    return new Promise((resolve, reject) => {
        if (channelNames.length === 0) return reject('Channel names must be defined.');
        let names = new Set(channelNames);
        let promises = [];

        names.forEach(channelName => {
            promises.push(loadBTTVChannel(channelName));
        });

        Promise.all(promises).then(resolve).catch(reject);
    });
}

/**
 * Loads the channel that the emote belongs to, Twitch and global BTTV only.
 * @param emoteName - Name of emote.
 * @return Promise containing emote.
 */
function loadByEmote(emoteName){
    return new Promise((resolve, reject) => {
        if (!emoteName) return reject('Emote name must be defined.');

        getEmoteList().then(emoteRes => {
            let emote = _.find(emoteRes, obj => obj.code === emoteName);

            if (_.size(emote) === 0){
                // Can't search through all BTTV channels, so only global BTTV.
                return getBTTVEmoteList().then(bttvRes => {
                    let emote = bttvRes.find(e => e.code === emoteName);
                    if (!emote) reject('Emote ' + emoteName + ' not found.');

                    loadBTTVChannel().then(c => resolve(c.emotes.get(emoteName))).catch(reject);
                }).catch(reject);
            }

            let channelEmotes = _.pickBy(emoteRes, val => val.channel === emote.channel);
            let channelName = channelEmotes[Object.keys(channelEmotes)[0]].channel;

            // Defaults to global Twitch.
            let channel = cacheChannelData(channelEmotes, channelName);
            if (channel.name === TWITCH_GLOBAL) resolve(channel.emotes.get(emoteName));

            // Also load BTTV emotes for this channel as well.
            loadBTTVChannel(channel.name).then(() => resolve(channel.emotes.get(emoteName))).catch(reject);
        }).catch(reject);
    });
}

/**
 * Get Twitch channel by name.
 * @param name - Name of channel.
 * @return Promise containing channel.
 */
function channel(channelName){
    return new Promise((resolve, reject) => {
        // Lowercase channel names.
        let name = channelName ? channelName.toLowerCase() : TWITCH_GLOBAL;

        // Defaults to global Twitch.
        let channelObj = channels.get(name || TWITCH_GLOBAL);
        if (channelObj) return resolve(channelObj);

        if (name === TWITCH_GLOBAL){
            return loadChannel().then(resolve).catch(reject);
        }

        if (name === BTTV_GLOBAL){
            return loadBTTVChannel().then(resolve).catch(reject);
        }

        // Load both.
        let twitch = loadChannel(name);
        let bttv = loadBTTVChannel(name);

        // Ignore Promise rejects.
        Promise.all([twitch, bttv].map(p => p.catch(e => e))).then(() => {
            getChannel(name) ? resolve(getChannel(name)) : reject('Channel "' + name + '" not found.');
        }).catch(reject);
    });
}

/**
 * Get Twitch channel by name, as long as it is in the cache.
 * @param name - Name of channel.
 * @return Channel object.
 */
function getChannel(channelName){
    // Lowercase channel names.
    let name = channelName ? channelName.toLowerCase() : TWITCH_GLOBAL;

    // Defaults to global Twitch.
    let channelObj = channels.get(name || TWITCH_GLOBAL);
    return channelObj;
}

/**
 * Get emote by name.
 * @param emoteName - Name of emote.
 * @param Promise containing emote.
 */
function emote(emoteName){
    return new Promise((resolve, reject) => {
        if (!emoteName) return reject('Emote name must be defined.');

        let emoteObj = emotes.get(emoteName);
        let bttvObj = bttv.get(emoteName);
        if (emoteObj || bttvObj) return resolve(emoteObj || bttvObj);

        // If this a channel:emote name.
        if (/:/.test(emoteName)){
            let cName = emoteName.split(':')[0];
            let eName = emoteName.split(':')[1];

            if (!eName) return reject('Emote name must be defined.');

            let emoteObj = emotes.get(eName);
            let bttvObj = bttv.get(eName);
            if (emoteObj || bttvObj) return resolve(emoteObj || bttvObj);

            if (cName === TWITCH_GLOBAL || cName === BTTV_GLOBAL){
                return loadByEmote(eName).then(resolve).catch(reject);
            }

            return channel(cName).then(() => resolve(getEmote(eName))).catch(reject);
        }

        loadByEmote(emoteName).then(resolve).catch(reject);
    });
}

/**
 * Get emote by name, as long as it is in the cache.
 * @param emoteName - Name of emote.
 * @param Emote object.
 */
function getEmote(emoteName){
    if (!emoteName) return null;

    let emoteObj = emotes.get(emoteName);
    let bttvObj = bttv.get(emoteName);
    if (emoteObj || bttvObj) return (emoteObj || bttvObj);

    // If this a channel:emote name.
    if (/:/.test(emoteName)){
        let eName = emoteName.split(':')[1];

        if (!eName) return null;

        let emoteObj = emotes.get(eName);
        let bttvObj = bttv.get(eName);
        return (emoteObj || bttvObj);
    }
}

/**
 * Parses text into one with the emotes formatted in. Emotes are only parsed if they are cached.
 * @param text - Text to parse.
 * @param type - One of: 'html', 'markdown', 'bbcode', or 'plain'.
 * @param size - Image size, 0 to 2, default 0.
 * @param start - Opening character.
 * @param end - Closing character.
 * @param custom - A custom format.
 * @return The formatted string.
 */
function parse(text, type = 'html', size = 0, start = '', end = start, custom = ''){
    if (!text) return null;

    if (!/html|markdown|bbcode|plain/i.test(type)) type = 'html';
    if (size < 0 || size > 2) size = 0;

    let s = start;
    let e = end;

    if (s && !/^[a-zA-Z]/.test(s)) s = '\\' + s;
    if (e && !/^[a-zA-Z]/.test(e)) e = '\\' + e;

    // Regex that splits the string into words, symbols, spaces, and emote pattern e.g. :Kappa:
    let reg = new RegExp('(' + s + '[\\w\\d\\(\\)]+' + e + ')|' + PUNCTUATIONS, 'g');
    let words = text.match(reg);
    let emotes = [];

    // Regex to test if this is an emote pattern.
    let emoteReg = new RegExp('(' + s + '[\\w\\d\\(\\)]+' + e + ')', 'g');

    // Regex to replace the limiters.
    let limitReg = new RegExp('^' + s + '|' + e + '$', 'g');

    words.forEach(w => {
        if (emoteReg.test(w)){
            let emote = getEmote(w.replace(limitReg, ''));
            return emotes.push(emote);
        }

        emotes.push('');
    });

    let template = custom || FORMAT_TEMPLATE[type.toUpperCase()];
    return words.map((w, i) => emotes[i] instanceof Emote ? template.replace(/{size}/g, size).replace(/{name}/g, emotes[i].name).replace(/{link}/g, emotes[i].toLink(size)) : w).join('');
}

/**
 * Parses text into one with the emotes formatted in. This can take a long time, as all words are checked.
 * @param text - Text to parse.
 * @param type - One of: 'html', 'markdown', 'bbcode', or 'plain'.
 * @param size - Image size, 0 to 2, default 0.
 * @param start - Opening character.
 * @param end - Closing character.
 * @param custom - A custom format.
 * @return Promise containing formatted string.
 */
function parseAll(text, type = 'html', size = 0, start = '', end = start, custom = ''){
    return new Promise((resolve, reject) => {
        if (!text) return reject('text must be defined');

        if (!/html|markdown|bbcode|plain/i.test(type)) type = 'html';
        if (size < 0 || size > 2) size = 0;

        let s = start;
        let e = end;

        if (s && !/^[a-zA-Z]/.test(s)) s = '\\' + s;
        if (e && !/^[a-zA-Z]/.test(e)) e = '\\' + e;

        // Regex that splits the string into words, symbols, spaces, and emote pattern e.g. :Kappa:
        let reg = new RegExp('(' + s + '[\\w\\d\\(\\)]+' + e + ')|' + PUNCTUATIONS, 'g');
        let words = text.match(reg);
        let emotes = [];

        // Regex to test if this is an emote pattern.
        let emoteReg = new RegExp('(' + s + '[\\w\\d\\(\\)]+' + e + ')', 'g');

        // Regex to replace the limiters.
        let limitReg = new RegExp('^' + s + '|' + e + '$', 'g');

        words.forEach(w => {
            if (emoteReg.test(w)){
                let emotePromise = emote(w.replace(limitReg, ''));
                return emotes.push(emotePromise);
            }

            emotes.push(Promise.resolve(''));
        });

        Promise.all(emotes.map(p => p.catch(e => e))).then(emotes => {
            let template = custom || FORMAT_TEMPLATE[type.toUpperCase()];
            resolve(words.map((w, i) => emotes[i] instanceof Emote ? template.replace(/{size}/g, size).replace(/{name}/g, emotes[i].name).replace(/{link}/g, emotes[i].toLink(size)) : w).join(''));
        }).catch(reject);
    });
}

/** Clears the caches. */
function clearCache(){
    channels.clear();
    emotes.clear();
    bttv.clear();
}

/**
 * Gets a copy of the caches.
 * @return Object with Caches.
 */
function cache(){
    return {
        channels: new Cache(channels),
        emotes: new Cache(emotes),
        bttvEmotes: new Cache(bttv)
    };
}

module.exports = {
    Channel, channel, getChannel,
    Emote, emote, getEmote,
    TWITCH_GLOBAL, loadChannel, loadChannels,
    BTTV_GLOBAL, loadBTTVChannel, loadBTTVChannels,
    loadAllChannels,
    Cache, cache, clearCache,
    parse, parseAll
};