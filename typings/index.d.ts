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
        public constructor(
            clientId?: string,
            clientSecret?: string,
            options?: {
                apiClient?: object
            }
        );

        public emotes: Collection<string, Emote>;
        public channels: Collection<string, Channel>;

        public fetchTwitchEmotes(id?: number): Promise<Collection<string, TwitchEmote>>;
        public fetchBTTVEmotes(id?: number): Promise<Collection<string, BTTVEmote>>;
        public fetchFFZEmotes(id: number): Promise<Collection<string, FFZEmote>>;
        public fetchSevenTVEmotes(id?: number, format?: 'webp' | 'avif'): Promise<Collection<string, SevenTVEmote>>;
        public fromObject(emotesArray: EmoteObject[]): Emote[];
    }

    export class EmoteParser {
        public constructor(
            fetcher: EmoteFetcher, 
            options: {
                template?: string,
                type?: string,
                match?: RegExp
            }
        );

        public parse(text: string, size?: number): string;
    }

    export class TwitchEmote extends Emote {
        public constructor(channel: Channel, id: string, data: object);

        public set?: string;
        public animated: boolean;
        public imageType: 'png' | 'gif';
        public readonly owner: Channel;

        public toLink(size: number): string;
        public toObject(): EmoteObject;
    }

    export class BTTVEmote extends Emote {
        public constructor(channel: Channel, id: string, data: any);

        public ownerName: string | null;
        public animated: boolean;
        public imageType: 'webp';
        public readonly owner?: Channel;

        public toLink(size: number): string;
        public toObject(): EmoteObject;
    }

    export class FFZEmote extends Emote {
        public constructor(channel: Channel, id: string, data: object);

        public ownerName: string | null;
        public sizes: string[];
        public animated: boolean;
        public imageType: 'png' | 'webp';
        public modifier: boolean;
        public readonly owner?: Channel;

        public toLink(size: number): string;
        public toObject(): EmoteObject;
    }

    export class SevenTVEmote extends Emote {
        public constructor(channel: Channel, id: string, data: object);

        public ownerName: string | null;
        public sizes: string[];
        public animated: boolean;
        public imageType: 'webp' | 'avif';
        public readonly owner?: Channel;

        public toLink(size: number): string;
        public toObject(): EmoteObject;
    }

    export interface EmoteObject {
        code: string,
        id: string,
        channel_id: string,
        type: 'twitch' | 'bttv' | 'ffz' | '7tv'
        animated?: boolean,
        ownerName?: string,
        sizes?: string[],
        set?: string,
        imageType?: string
    }

    export class Collection<K, V> extends Map<K, V> {
        public find(propOrFunc: string | ((item: K, index: number, coll: this) => boolean), value?: any): K;
        public filter(func: (item: K, index: number, coll: this) => boolean): Collection<K, V>;
        public map(func: (item: K, index: number, coll: this) => any): Array<any>;
    }
}
