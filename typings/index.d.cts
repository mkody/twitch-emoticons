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

  public apiClient?: object
  public forceStatic: boolean
  public twitchThemeMode: 'dark' | 'light'
  public emotes: Collection<string, Emote>
  public channels: Collection<string, Channel>
  public ffzModifiersFetched: boolean

  public fetchTwitchEmotes (
    channel?: number
  ): Promise<Collection<string, TwitchEmote>>

  public fetchBTTVEmotes (
    channel?: number
  ): Promise<Collection<string, BTTVEmote>>

  public fetchFFZEmotes (
    channel?: number
  ): Promise<Collection<string, FFZEmote>>

  public fetchSevenTVEmotes (
    channel?: number,
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

  public fetcher: EmoteFetcher
  public options: {
    template: string,
    type: 'html' | 'markdown' | 'bbcode' | 'plain',
    match: RegExp
  }

  public parse (
    text: string,
    options?: {
      size?: number,
      forceStatic?: boolean,
      themeMode?: 'dark' | 'light'
    }
  ): string
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

  public toLink (): string

  public toString (): string

  public toObject (): EmoteObject
}

declare class TwitchEmote extends Emote {
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  public set: string | null;
  public imageType: 'png' | 'gif'
  public animated: boolean

  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean,
      themeMode?: 'dark' | 'light'
    }
  ): string

  public fromObject (
    emoteObject: EmoteObject,
    channel: Channel
  ): TwitchEmote
}

declare class BTTVEmote extends Emote {
  public constructor (
    channel: Channel,
    id: string,
    data: any
  )

  public ownerName: string | null
  public imageType: 'webp'
  public animated: boolean

  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean
    }
  ): string

  public toObject (): EmoteObject

  public fromObject (
    emoteObject: EmoteObject,
    channel: Channel
  ): BTTVEmote
}

declare class FFZEmote extends Emote {
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  public ownerName: string | null
  public sizes: string[]
  public imageType: 'png' | 'webp'
  public animated: boolean
  public zeroWidth: boolean
  public modifier: boolean

  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean
    }
  ): string

  public toObject (): EmoteObject

  public fromObject (
    emoteObject: EmoteObject,
    channel: Channel
  ): FFZEmote
}

declare class SevenTVEmote extends Emote {
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  public ownerName: string | null
  public sizes: string[]
  public imageType: 'webp' | 'avif'
  public animated: boolean
  public zeroWidth: boolean
  public nsfw: boolean

  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean
    }
  ): string

  public toObject (): EmoteObject

  public fromObject (
    emoteObject: EmoteObject,
    channel: Channel
  ): SevenTVEmote
}

interface EmoteObject {
  code: string,
  id: string,
  channel_id: string | null,
  type: 'twitch' | 'bttv' | 'ffz' | '7tv' | null,
  set?: string,
  ownerName?: string,
  sizes?: string[],
  imageType?: string
  animated?: boolean,
  zeroWidth?: boolean,
  nsfw?: boolean
  modifier?: boolean
}

declare const Constants: {
  Twitch: {
    CDN: (
      id: string,
      size?: number,
      forceStatic?:
      boolean,
      theme?: 'dark' | 'light'
    ) => string;
  };
  BTTV: {
    Global: string;
    Channel: (
      id: string
    ) => string;
    CDN: (
      id: string,
      size?: number,
      forceStatic?: boolean
    ) => string;
  };
  SevenTV: {
    GQL: string;
    GlobalQuery: string;
    ChannelQuery: string;
    CDN: (
      id: string,
      format: string,
      size?: number,
      forceStatic?: boolean
    ) => string;
  };
  FFZ: {
    sets: {
      Global: number;
      Modifiers: number;
    };
    Set: (
      id: string
    ) => string;
    Channel: (
      id: string
    ) => string;
    CDN: (
      id: string,
      size?: number
    ) => string;
    CDNAnimated: (
      id: string,
      size?: number
    ) => string;
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
