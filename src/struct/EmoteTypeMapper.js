import BTTVEmote from './BTTVEmote.js';
import FFZEmote from './FFZEmote.js';
import SevenTVEmote from './SevenTVEmote.js';
import TwitchEmote from './TwitchEmote.js';

class EmoteTypeMapper {
    static getClassByType(type) {
        const classMap = { BTTVEmote, FFZEmote, SevenTVEmote, TwitchEmote };
        return classMap[type] || null;
    }
}

export default EmoteTypeMapper;
