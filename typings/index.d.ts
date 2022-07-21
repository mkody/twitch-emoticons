declare module '@mkody/twitch-emoticons' {
    export class Channel {
        public constructor(fetcher: EmoteFetcher, id: number);

        public fetcher: EmoteFetcher;
        public id: number;
        public emotes: Collection<string, Emote>;

        public fetchBTTVEmotes(): Promise<Collection<string, BTTVEmote>>;
        public fetchFFZEmotes(): Promise<Collection<string, FFZEmote>>;
        public fetchSevenTVEmotes(): Promise<Collection<string, SevenTVEmote>>;
    }

    export abstract class Emote {
        public constructor(channel: Channel, id: string, data: object);

        public fetcher: EmoteFetcher;
        public channel: Channel;
        public id: string;
        public type: 'twitch' | 'bttv' | 'ffz' | '7tv';
        public code: string;
    }

    export class EmoteFetcher {
        public constructor(clientId?: string, clientSecret?: string);

        public emotes: Collection<string, Emote>;
        public channels: Collection<string, Channel>;

        public fetchTwitchEmotes(id?: number): Promise<Collection<string, TwitchEmote>>;
        public fetchBTTVEmotes(id?: number): Promise<Collection<string, BTTVEmote>>;
        public fetchFFZEmotes(id: number): Promise<Collection<string, FFZEmote>>;
        public fetchSeventTVEmotes(id?: number): Promise<Collection<string, SevenTVEmote>>;
    }

    export class EmoteParser {
        public constructor(fetcher: EmoteFetcher, options: {
            template?: string,
            type?: string,
            match?: RegExp
        });

        public parse(text: string, size?: number): string;
    }

    export class TwitchEmote extends Emote {
        public constructor(channel: Channel, id: string, data: object);

        public set?: string;
        public imageType: string;
        public readonly owner: Channel;

        public toLink(size: number): string;
    }

    export class BTTVEmote extends Emote {
        public constructor(channel: Channel, id: string, data: any);

        public ownerName: string;
        public imageType: string;
        public readonly owner?: Channel;

        public toLink(size: number): string;
    }

    export class FFZEmote extends Emote {
        public constructor(channel: Channel, id: string, data: object);

        public ownerName: string;
        public sizes: string[];
        public imageType: string;
        public readonly owner?: Channel;

        public toLink(size: number): string;
    }

    export class SevenTVEmote extends Emote {
        public constructor(channel: Channel, id: string, data: object);

        public ownerName: string;
        public sizes: string[];
        public imageType: string;
        public readonly owner?: Channel;

        public toLink(size: number): string;
    }

    export class Collection<K, V> extends Map<K, V> {
        public find(propOrFunc: string | ((item: K, index: number, coll: this) => boolean), value?: any): K;
        public filter(func: (item: K, index: number, coll: this) => boolean): Collection<K, V>;
        public map(func: (item: K, index: number, coll: this) => any): Array<any>;
    }
}
