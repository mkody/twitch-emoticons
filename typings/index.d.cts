declare class Channel {
  public constructor (
    fetcher: EmoteFetcher,
    id: number
  )

  public fetcher: EmoteFetcher
  public id: number
  public emotes: Collection<string, Emote>

  public fetchBTTVEmotes (): Promise<Collection<string, BTTVEmote>>

  public fetchFFZEmotes (): Promise<Collection<string, FFZEmote>>

  public fetchSevenTVEmotes (): Promise<Collection<string, SevenTVEmote>>
}

declare abstract class Emote {
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  public fetcher: EmoteFetcher
  public channel: Channel
  public id: string
  public type: 'twitch' | 'bttv' | 'ffz' | '7tv' | null
  public code: string
}

declare class EmoteFetcher {
  public constructor (
    options?: {
      twitchAppID?: string,
      twitchAppSecret?: string,
      apiClient?: object,
      forceStatic?: boolean,
      twitchThemeMode?: 'dark' | 'light'
    }
  )

  public emotes: Collection<string, Emote>
  public channels: Collection<string, Channel>
  public forceStatic: boolean
  public twitchThemeMode: 'dark' | 'light'

  public fetchTwitchEmotes (
    id?: number
  ): Promise<Collection<string, TwitchEmote>>

  public fetchBTTVEmotes (
    id?: number
  ): Promise<Collection<string, BTTVEmote>>

  public fetchFFZEmotes (
    id?: number
  ): Promise<Collection<string, FFZEmote>>

  public fetchSevenTVEmotes (
    id?: number,
    options?: {
      format?: 'webp' | 'avif'
    }
  ): Promise<Collection<string, SevenTVEmote>>

  public fromObject (
    emotesArray: EmoteObject[]
  ): Emote[]
}

declare class EmoteParser {
  public constructor (
    fetcher: EmoteFetcher,
    options?: {
      template?: string,
      type?: 'html' | 'markdown' | 'bbcode' | 'plain',
      match?: RegExp
    }
  )

  public parse (
    text: string,
    options?: {
      size?: number,
      forceStatic?: boolean,
      themeMode?: 'dark' | 'light'
    }
  ): string
}

declare class TwitchEmote extends Emote {
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  public set?: string;
  public animated: boolean
  public imageType: 'png' | 'gif'
  public readonly owner: Channel

  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean,
      themeMode?: 'dark' | 'light'
    }
  ): string

  public toObject (): EmoteObject
}

declare class BTTVEmote extends Emote {
  public constructor (
    channel: Channel,
    id: string,
    data: any
  )

  public ownerName: string | null
  public animated: boolean
  public imageType: 'webp'
  public readonly owner?: Channel

  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean
    }
  ): string

  public toObject (): EmoteObject
}

declare class FFZEmote extends Emote {
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  public ownerName: string | null
  public sizes: string[]
  public animated: boolean
  public imageType: 'png' | 'webp'
  public modifier: boolean
  public readonly owner?: Channel

  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean
    }
  ): string

  public toObject (): EmoteObject
}

declare class SevenTVEmote extends Emote {
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  public ownerName: string | null
  public sizes: string[]
  public animated: boolean
  public imageType: 'webp' | 'avif'
  public readonly owner?: Channel

  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean
    }
  ): string

  public toObject (): EmoteObject
}

interface EmoteObject {
  code: string,
  id: string,
  channel_id: string | null,
  type: 'twitch' | 'bttv' | 'ffz' | '7tv' | null,
  animated?: boolean,
  ownerName?: string,
  sizes?: string[],
  set?: string,
  imageType?: string
}

declare const Constants: {
  Twitch: {
    CDN: (id: string, size?: number, forceStatic?: boolean, theme?: 'dark' | 'light') => string;
  };
  BTTV: {
    Global: string;
    Channel: (id: string) => string;
    CDN: (id: string, size?: number, forceStatic?: boolean) => string;
  };
  SevenTV: {
    Global: string;
    Channel: (id: string) => string;
    CDN: (id: string, format: string, size?: number, forceStatic?: boolean) => string;
  };
  FFZ: {
    sets: {
      Global: number;
      Modifiers: number;
    };
    Set: (id: string) => string;
    Channel: (id: string) => string;
    CDN: (id: string, size?: number) => string;
    CDNAnimated: (id: string, size?: number) => string;
  };
  Templates: {
    html: string;
    markdown: string;
    bbcode: string;
    plain: string;
  };
}

declare class Collection<K, V> extends Map<K, V> {
  public find (
    propOrFunc: string | ((item: V, index: number, coll: this) => boolean),
    value?: any
  ): V

  public filter (
    func: (item: V, index: number, coll: this) => boolean
  ): Collection<K, V>

  public map (
    func: (item: V, index: number, coll: this) => any
  ): Array<any>
}

export {
  Channel,
  Emote,
  EmoteFetcher,
  EmoteParser,
  TwitchEmote,
  BTTVEmote,
  FFZEmote,
  SevenTVEmote,
  Collection,
  Constants,
}
