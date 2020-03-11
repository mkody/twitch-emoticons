declare module 'twitch-emoticons' {
    export class BTTVEmote extends Emote {
        public constructor(channel: Channel, id: string, data: any);

        public ownerName: string;
        public imageType: string;
        public readonly owner?: Channel;
    }

    export class Channel {
        public constructor(fetcher: EmoteFetcher, name: string);

        public fetcher: EmoteFetcher;
        public name: string;
        public emotes: Collection<string, Emote>;

        public fetchBTTVEmotes(): Promise<Collection<string, BTTVEmote>>;
        public fetchFFZEmotes(): Promise<Collection<string, FFZEmote>>;
    }

    export abstract class Emote {
        public constructor(channel: Channel, id: string, data: object);

        public fetcher: EmoteFetcher;
        public channel: Channel;
        public id: string;
        public type: 'twitch' | 'bttv' | 'ffz';
        public code: string;

        public toLink(size: number): string;
    }

    export class EmoteFetcher {
        public emotes: Collection<string, Emote>;
        public channels: Collection<string, Channel>;

        public fetchTwitchEmotes(id?: number): Promise<Collection<string, TwitchEmote>>;
        public fetchBTTVEmotes(name?: string): Promise<Collection<string, BTTVEmote>>;
        public fetchFFZEmotes(name: string): Promise<Collection<string, FFZEmote>>;
    }

    export class EmoteParser {
        public constructor(fetcher: EmoteFetcher, options: {
            template?: string,
            type?: string,
            match?: RegExp 
        });

        public parse(text: string, size?: number): string;
    }

    export class FFZEmote extends Emote {
        public constructor(channel: Channel, id: string, data: object);

        public ownerName: string;
        public sizes: string[];
        public imageType: string;
        public readonly owner?: Channel;
    }

    export class TwitchEmote extends Emote {
        public constructor(channel: Channel, id: string, data: object);

        public set?: string;
        public imageType: string;
        public readonly owner: Channel;
    }

    export class Collection<K, V> extends Map<K, V> {
        public find(propOrFunc: string | ((item: K, index: number, coll: this) => boolean), value?: any): K;
        public filter(func: (item: K, index: number, coll: this) => boolean): Collection<K, V>;
        public map(func: (item: K, index: number, coll: this) => any): Array<any>;
    }
}
