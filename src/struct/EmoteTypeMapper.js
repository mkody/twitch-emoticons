const BTTVEmote = require('./BTTVEmote');
const FFZEmote = require('./FFZEmote');
const SevenTVEmote = require('./SevenTVEmote');
const TwitchEmote = require('./TwitchEmote');

class EmoteTypeMapper {
    static getClassByType(type) {
        const classMap = { BTTVEmote, FFZEmote, SevenTVEmote, TwitchEmote };
        return classMap[type] || null;
    }
}

module.exports = EmoteTypeMapper;
