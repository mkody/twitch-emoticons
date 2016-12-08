const _ = require('lodash');
const request = require('superagent');

const TWITCH_EMOTES = 'https://twitchemotes.com/api_cache/v2/images.json';
const LINK_TEMPLATE = {
    SMALL: 'https://static-cdn.jtvnw.net/emoticons/v1/imageID/1.0',
    MEDIUM: 'https://static-cdn.jtvnw.net/emoticons/v1/imageID/2.0',
    LARGE: 'https://static-cdn.jtvnw.net/emoticons/v1/imageID/3.0'
};

class Channel {
    constructor(name, emotes){
        /** Name of the Twitch channel. */
        this.name = name;

        /** Emotes belonging to this channel. */
        this.emotes = emotes;
    }
}

class Emote {
    constructor(id, name, channel){
        /** ID of the emote. */
        this.id = id;

        /** Name of the emote. */
        this.name = name;

        /** Channel this emote belongs to. */
        this.channel = channel;
    }

    /** Gets the image link for this emote. Size is 0 to 2. */
    toLink(size = 2){
        if (size === 0) return LINK_TEMPLATE.SMALL.replace('imageID', this.id);
        if (size === 1) return LINK_TEMPLATE.MEDIUM.replace('imageID', this.id);
        if (size === 2) return LINK_TEMPLATE.LARGE.replace('imageID', this.id);
    }

    toString(){
        return this.toLink();
    }
}

/** Cached channels. */
let channels = new Map();

/** Cached emotes. */
let emotes = new Map();

function addChannel(channel){
    channels.set(channel.name, channel);
    channel.emotes.forEach(e => emotes.set(e.name, e));
}

function getEmoteList(){
    return new Promise((resolve, reject) => {
        request(TWITCH_EMOTES).end((err, res) => {
            if (err) return reject(err);
            resolve(res.body.images);
        });
    });
}

/** Loads a channel and its emotes. */
function loadChannel(channelName){
    return new Promise((resolve, reject) => {
        getEmoteList().then(emoteRes => {
            let channelEmotes = _.pickBy(emoteRes, (val, key) => val.channel === channelName);
            if (channelEmotes.length === 0) reject('Channel not found.');

            let channel = new Channel(channelName);
            let emotes = new Map();

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

/** Loads multiple channels and their emotes. */
function loadChannels(channelNames){
    return new Promise((resolve, reject) => {
        getEmoteList().then(emoteRes => {
            let channels = [];

            channelNames.forEach(channelName => {
                let channelEmotes = _.pickBy(emoteRes, (val, key) => val.channel === channelName);
                if (_.size(channelEmotes) === 0) reject('Channel not found.');

                let channel = new Channel(channelName);
                let emotes = new Map();

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

/** Loads the channel that the emote belongs to. */
function loadByEmote(emoteName){
    return new Promise((resolve, reject) => {
        getEmoteList().then(emoteRes => {
            let emote = _.find(emoteRes, (obj) => obj.code === emoteName);
            if (_.size(emote) === 0) reject('Emote not found.');

            let channelEmotes = _.pickBy(emoteRes, (val, key) => val.channel === emote.channel);

            let channelName = channelEmotes[Object.keys(channelEmotes)[0]].channel;
            let channel = new Channel(channelName);
            let emotes = new Map();

            _.forEach(channelEmotes, (val, key) => {
                let emote = new Emote(key, val.code, channel);
                emotes.set(emote.name, emote);
            });

            channel.emotes = emotes;
            addChannel(channel);

            resolve(channel.emotes.get(emoteName));
        }).catch(reject);
    });
}

/** Get Twitch channel by name. */
function channel(name){
    return new Promise((resolve, reject) => {
        let channel = channels.get(name);
        if (channel) return resolve(channel);

        loadChannel(name).then(resolve).catch(reject);
    });
}

/** Get emote by name. */
function emote(name){
    return new Promise((resolve, reject) => {
        let emote = emotes.get(name);
        if (emote) return resolve(emote);

        loadByEmote(name).then(resolve).catch(reject);
    });
}

module.exports = {
    channels, emotes,
    channel, emote, 
    loadChannel, loadChannels
};