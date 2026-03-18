import { type ApiClient } from '@twurple/api'

declare class Channel {
  /**
   * A Twitch channel.
   * @param {EmoteFetcher} fetcher - The emote fetcher.
   * @param {number} id - ID of the channel.
   */
  public constructor (
    fetcher: EmoteFetcher,
    id: number
  )

  /** The emote fetcher. */
  public fetcher: EmoteFetcher

  /**
   * The ID of the channel.
   * This is `null` for global emotes.
   */
  public id: number | null

  /** Cached {@linkcode Emote}s belonging to this channel. */
  public emotes: Collection<string, Emote>

  /**
   * Fetches the BTTV emotes for this channel.
   * @returns {Promise<Collection<string, BTTVEmote>>} - A promise that resolves to a collection of {@linkcode BTTVEmote}s.
   */
  public fetchBTTVEmotes (): Promise<Collection<string, BTTVEmote>>

  /**
   * Fetches the FFZ emotes for this channel.
   * @returns {Promise<Collection<string, FFZEmote>>} - A promise that resolves to a collection of {@linkcode FFZEmote}s.
   */
  public fetchFFZEmotes (): Promise<Collection<string, FFZEmote>>

  /**
   * Fetches the 7TV emotes for this channel.
   * @returns {Promise<Collection<string, SevenTVEmote>>} - A promise that resolves to a collection of {@linkcode SevenTVEmote}s.
   */
  public fetchSevenTVEmotes (): Promise<Collection<string, SevenTVEmote>>
}

declare class EmoteFetcher {
  /**
   * Fetches and caches emotes.
   * @param {object} [options={}] Fetcher's options.
   * @param {string} [options.twitchAppID] Your app ID for the Twitch API.
   * @param {string} [options.twitchAppSecret] Your app secret for the Twitch API.
   * @param {ApiClient} [options.apiClient] - Bring your own Twurple {@linkcode ApiClient}.
   * @param {boolean} [options.forceStatic=false] - Force emotes to be static (non-animated).
   * @param {'dark' | 'light'} [options.twitchThemeMode='dark'] - Theme mode (background color) preference for Twitch emotes.
   */
  public constructor (
    options?: {
      twitchAppID?: string,
      twitchAppSecret?: string,
      apiClient?: ApiClient,
      forceStatic?: boolean,
      twitchThemeMode?: 'dark' | 'light'
    }
  )

  /** Either a provided Twitch {@linkcode ApiClient} or one created internally. */
  public apiClient?: ApiClient

  /** Force emotes to be static (non-animated). */
  public forceStatic: boolean

  /** Theme mode (background color) preference for Twitch emotes. */
  public twitchThemeMode: 'dark' | 'light'

  /**
   * Cached {@linkcode Emote}s.
   * Collectioned by emote code to the {@linkcode Emote} instance.
   */
  public emotes: Collection<string, Emote>

  /**
   * Cached {@linkcode Channel}s.
   * Collectioned by name to the {@linkcode Channel} instance.
   */
  public channels: Collection<string, Channel>

  /** Save if we fetched FFZ's modifier emotes once. */
  public ffzModifiersFetched: boolean

  /**
   * Fetches the Twitch emotes for a channel.
   * Use `null` for the global emotes channel.
   * @param {number} [channel] - ID of the channel.
   * @returns {Promise<Collection<string, TwitchEmote>>} - A promise that resolves to a collection of {@linkcode TwitchEmote}s.
   */
  public fetchTwitchEmotes (
    channel?: number
  ): Promise<Collection<string, TwitchEmote>>

  /**
   * Fetches the BTTV emotes for a channel.
   * Use `null` for the global emotes channel.
   * @param {number} [channel] - ID of the channel.
   * @returns {Promise<Collection<string, BTTVEmote>>} - A promise that resolves to a collection of {@linkcode BTTVEmote}s.
   */
  public fetchBTTVEmotes (
    channel?: number
  ): Promise<Collection<string, BTTVEmote>>

  /**
   * Fetches the FFZ emotes for a channel.
   * @param {number} [channel] - ID of the channel.
   * @returns {Promise<Collection<string, FFZEmote>>} - A promise that resolves to a collection of {@linkcode FFZEmote}s.
   */
  public fetchFFZEmotes (
    channel?: number
  ): Promise<Collection<string, FFZEmote>>

  /**
   * Fetches the 7TV emotes for a channel.
   * @param {number} [channel] - ID of the channel.
   * @param {object} [options] - Options for fetching.
   * @param {('webp'|'avif')} [options.format] - The type file format to use (webp/avif).
   * @returns {Promise<Collection<string, SevenTVEmote>>} - A promise that resolves to a collection of {@linkcode SevenTVEmote}s.
   */
  public fetchSevenTVEmotes (
    channel?: number,
    options?: {
      format?: 'webp' | 'avif'
    }
  ): Promise<Collection<string, SevenTVEmote>>

  /**
   * Converts emote objects to emotes
   * @param {object[]} [emotesArray] - An array of {@linkcode EmoteObject}s
   * @throws {TypeError} When an emote has an unknown type.
   * @returns {Emote[]} - An array of {@linkcode Emote} instances.
   */
  public fromObject (
    emotesArray: EmoteObject[]
  ): Emote[]
}

declare class EmoteParser {
  /**
   * A parser to replace text with emotes.
   * @param {EmoteFetcher} fetcher - The {@linkcode EmoteFetcher} to use the cache of.
   * @param {object} [options={}] - Options for the parser.
   * @param {string} [options.template=''] - The template to be used.
   * The strings that can be interpolated are:
   * - `{link}` The link of the emote.
   * - `{name}` The name of the emote.
   * - `{size}` The size index of the image.
   * - `{creator}` The channel/owner name of the emote.
   * @param {'html' | 'markdown' | 'bbcode' | 'plain'} [options.type='html'] - The type of the parser.
   * Can be one of `html`, `markdown`, `bbcode`, or `plain`.
   * If the `template` option is provided, this is ignored.
   * @param {RegExp} [options.match=/(\w+)/g] - The regular expression that matches an emote.
   * Must be a global regex, with one capture group for the emote code.
   */
  public constructor (
    fetcher: EmoteFetcher,
    options?: {
      template?: string,
      type?: 'html' | 'markdown' | 'bbcode' | 'plain',
      match?: RegExp
    }
  )

  /** The {@linkcode EmoteFetcher} being used. */
  public fetcher: EmoteFetcher

  /** The parser's options. */
  public options: {
    template: string,
    type: 'html' | 'markdown' | 'bbcode' | 'plain',
    match: RegExp
  }

  /**
   * Parses text.
   * @param {string} text - Text to parse.
   * @param {object} [options] - Parameters for parsing.
   * @param {number} [options.size] - Size (scale) for emotes.
   * @param {boolean} [options.forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
   * @param {'dark' | 'light'} [options.themeMode] - Only for Twitch: the preferred theme mode. Defaults to the fetcher's twitchThemeMode or `dark`.
   * @returns {string} - The parsed text.
   */
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
  /**
   * Base class for emotes.
   * This constructor is not to be used.
   * @param {Channel} channel - {@linkcode Channel} this emote belongs to.
   * @param {string} id - ID of the emote.
   * @param {data} data - The raw emote data.
   * @throws {Error} When trying to use the base Emote class directly.
   */
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  /** The {@linkcode EmoteFetcher} being used. */
  public fetcher: EmoteFetcher

  /**
   * The {@linkcode Channel} this emote belongs to.
   * Only accurate and constant on Twitch emotes.
   * For other types of emotes, use the `ownerName` property.
   */
  public channel: Channel

  /** The ID of the emote. */
  public id: string

  /** The type/platform of this emote. */
  public type: 'twitch' | 'bttv' | 'ffz' | '7tv' | null

  /** The code or name of the emote. */
  public code: string

  /**
   * Gets the image link of the emote.
   * @param {number} size - The size of the image.
   * @returns {string} - The URL to the emote.
   */
  public toLink (): string

  /**
   * Override for `toString`.
   * Will give the emote's name.
   * @returns {string} - The emote code.
   */
  public toString (): string

  /**
   * Override for `toObject`.
   * Will result in an Object representation of an {@linkcode Emote}.
   * @returns {object} - Object representation of the {@linkcode Emote}.
   */
  public toObject (): EmoteObject
}

declare class TwitchEmote extends Emote {
  /**
   * A Twitch emote.
   * @param {Channel} channel - {@linkcode Channel} this emote belongs to.
   * @param {string} id - ID of the emote.
   * @param {data} data - The raw emote data.
   */
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  /** The set ID of the emote. */
  public set: string | null;

  /** The image type of the emote. */
  public imageType: 'png' | 'gif'

  /** If the emote is animated. */
  public animated: boolean

  /**
   * Gets the image link of the emote.
   * @param {object} [options] - Options for the link.
   * @param {number} [options.size=0] - Size (scale) for the emote.
   * @param {boolean} [options.forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
   * @param {'dark' | 'light'} [options.themeMode] - Only for Twitch: the preferred theme mode. Defaults to the fetcher's twitchThemeMode or `dark`.
   * @returns {string} - The URL to the emote.
   */
  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean,
      themeMode?: 'dark' | 'light'
    }
  ): string

  /**
   * Override of the override for `toObject`.
   * Will result in an Object representation of a {@linkcode TwitchEmote}.
   * @returns {object} - Object representation of the {@linkcode TwitchEmote}.
   */
  public toObject (): EmoteObject

  /**
   * Converts an emote Object into a {@linkcode TwitchEmote}
   * @param {EmoteObject} [emoteObject] - Object representation of this emote
   * @param {Channel} [channel] - {@linkcode Channel} this emote belongs to.
   * @returns {TwitchEmote} - A {@linkcode TwitchEmote} instance.
   */
  public static fromObject (
    emoteObject: EmoteObject,
    channel: Channel
  ): TwitchEmote
}

declare class BTTVEmote extends Emote {
  /**
   * A BTTV emote.
   * @param {Channel} channel - {@linkcode Channel} this emote belongs to.
   * @param {string} id - ID of the emote.
   * @param {data} data - The raw emote data.
   */
  public constructor (
    channel: Channel,
    id: string,
    data: any
  )

  /**
   * The name of the emote owner.
   * Might be null for global emotes.
   */
  public ownerName: string | null

  /** The image type of the emote. */
  public imageType: 'webp'

  /** If the emote is animated. */
  public animated: boolean

  /**
   * Gets the image link of the emote.
   * @param {object} [options] - Options for the link.
   * @param {number} [options.size=0] - Size (scale) for the emote.
   * @param {boolean} [options.forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
   * @returns {string} - The URL to the emote.
   */
  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean
    }
  ): string

  /**
   * Override of the override for `toObject`.
   * Will result in an Object representation of a {@linkcode BTTVEmote}.
   * @returns {EmoteObject} - Object representation of the {@linkcode BTTVEmote}.
   */
  public toObject (): EmoteObject

  /**
   * Converts an emote Object into a {@linkcode BTTVEmote}
   * @param {EmoteObject} [emoteObject] - Object representation of this emote
   * @param {Channel} [channel] - {@linkcode Channel} this emote belongs to.
   * @returns {BTTVEmote} - A {@linkcode BTTVEmote} instance.
   */
  public static fromObject (
    emoteObject: EmoteObject,
    channel: Channel
  ): BTTVEmote
}

declare class FFZEmote extends Emote {
  /**
   * An FFZ emote.
   * @param {Channel} channel - {@linkcode Channel} this emote belongs to.
   * @param {string} id - ID of the emote.
   * @param {data} data - The raw emote data.
   */
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  /**
   * The name of the emote owner.
   * Might be null for global emotes.
   */
  public ownerName: string | null

  /** Available image sizes. */
  public sizes: string[]

  /** The image type of the emote. */
  public imageType: 'png' | 'webp'

  /** If the emote is animated. */
  public animated: boolean

  /** If emote can be zero-width (overlaying). */
  public zeroWidth: boolean

  /** If the emote is a modifier (effect) and should be hidden. */
  public modifier: boolean

  /**
   * Gets the image link of the emote.
   * @param {object} [options] - Options for the link.
   * @param {number} [options.size=0] - Size (scale) for the emote.
   * @param {boolean} [options.forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
   * @returns {string} - The URL to the emote.
   */
  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean
    }
  ): string

  /**
   * Override of the override for `toObject`.
   * Will result in an Object representation of a {@linkcode FFZEmote}.
   * @returns {EmoteObject} - Object representation of the {@linkcode FFZEmote}.
   */
  public toObject (): EmoteObject

  /**
   * Converts an emote Object into a {@linkcode FFZEmote}
   * @param {EmoteObject} [emoteObject] - Object representation of this emote
   * @param {Channel} [channel] - {@linkcode Channel} this emote belongs to.
   * @returns {FFZEmote} - A {@linkcode FFZEmote} instance.
   */
  public fromObject (
    emoteObject: EmoteObject,
    channel: Channel
  ): FFZEmote
}

declare class SevenTVEmote extends Emote {
  /**
   * A 7TV emote.
   * @param {Channel} channel - {@linkcode Channel} this emote belongs to.
   * @param {string} id - ID of the emote.
   * @param {data} data - The raw emote data.
   */
  public constructor (
    channel: Channel,
    id: string,
    data: object
  )

  /**
   * The name of the emote owner.
   * Might be null for global emotes.
   */
  public ownerName: string | null

  /** Available image sizes. */
  public sizes: string[]

  /** The image type of the emote. */
  public imageType: 'webp' | 'avif'

  /** If the emote is animated. */
  public animated: boolean

  /** If emote can be zero-width (overlaying). */
  public zeroWidth: boolean

  /**
   * If emote is NSFW.
   * Do note that this flag isn't always applied to what *looks* NSFW.
   */
  public nsfw: boolean

  /**
   * Gets the image link of the emote.
   * @param {object} [options] - Options for the link.
   * @param {number} [options.size=0] - Size (scale) for the emote.
   * @param {boolean} [options.forceStatic] - Whether to force the emote to be static (non-animated). Defaults to the fetcher's forceStatic or `false`.
   * @returns {string} - The URL to the emote.
   */
  public toLink (
    options?: {
      size: number,
      forceStatic?: boolean
    }
  ): string

  /**
   * Override of the override for `toObject`.
   * Will result in an Object representation of a {@linkcode SevenTVEmote}.
   * @returns {EmoteObject} - Object representation of the {@linkcode SevenTVEmote}.
   */
  public toObject (): EmoteObject

  /**
   * Converts an emote Object into a {@linkcode SevenTVEmote}
   * @param {EmoteObject} [emoteObject] - Object representation of this emote
   * @param {Channel} [channel] - {@linkcode Channel} this emote belongs to.
   * @returns {SevenTVEmote} - A {@linkcode SevenTVEmote} instance.
   */
  public static fromObject (
    emoteObject: EmoteObject,
    channel: Channel
  ): SevenTVEmote
}

interface EmoteObject {
  /** The code or name of the emote. */
  code: string,
  /** The ID of this emote. */
  id: string,
  /** The ID of the channel this emote belongs to. */
  channel_id: string | null,
  /** The type/platform of this emote. */
  type: 'twitch' | 'bttv' | 'ffz' | '7tv' | null,
  /** The ID of the set this emote belongs to. (Only {@linkcode TwitchEmote}) */
  set?: string,
  /** The name of the emote owner. (Only {@linkcode BTTVEmote}, {@linkcode FFZEmote}, {@linkcode SevenTVEmote}) */
  ownerName?: string,
  /** Available image sizes. (Only {@linkcode BTTVEmote}, {@linkcode FFZEmote}, {@linkcode SevenTVEmote}) */
  sizes?: string[],
  /** The image type of the emote. */
  imageType?: string
  /** If the emote is animated. */
  animated?: boolean,
  /** If emote can be zero-width (overlaying). (Only {@linkcode FFZEmote}, {@linkcode SevenTVEmote}) */
  zeroWidth?: boolean,
  /** If emote is NSFW. (Only {@linkcode SevenTVEmote}) */
  nsfw?: boolean
  /** If the emote is a modifier (effect) and should be hidden. (Only {@linkcode FFZEmote}) */
  modifier?: boolean
}

declare const Constants: {
  /** Constants for Twitch. */
  Twitch: {
    /** Function to get the CDN URL for a {@linkcode TwitchEmote}. */
    CDN: (
      id: string,
      size?: number,
      forceStatic?:
      boolean,
      theme?: 'dark' | 'light'
    ) => string;
  };
  /** Constants for BTTV. */
  BTTV: {
    /** API URL for global emotes. */
    Global: string;
    /** Function to get the API URL for channel emotes. */
    Channel: (
      id: string
    ) => string;
    /** Function to get the CDN URL for a {@linkcode BTTVEmote}. */
    CDN: (
      id: string,
      size?: number,
      forceStatic?: boolean
    ) => string;
  };
  /** Constants for 7TV. */
  SevenTV: {
    /** GraphQL endpoint for 7TV. */
    GQL: string;
    /** GraphQL query for global emotes. */
    GlobalQuery: string;
    /** GraphQL query for channel emotes. */
    ChannelQuery: string;
    /** Function to get the CDN URL for a {@linkcode SevenTVEmote}. */
    CDN: (
      id: string,
      format: string,
      size?: number,
      forceStatic?: boolean
    ) => string;
  };
  /** Constants for FFZ. */
  FFZ: {
    /** Reference for FFZ sets. */
    sets: {
      Global: number;
      Modifiers: number;
    };
    /** API URL to resolve a FFZ set. */
    Set: (
      id: string
    ) => string;
    /** API URL to get a FFZ channel's emotes. */
    Channel: (
      id: string
    ) => string;
    /** Function to get the CDN URL for a {@linkcode FFZEmote}. */
    CDN: (
      id: string,
      size?: number
    ) => string;
    /** Function to get the CDN URL for an animated {@linkcode FFZEmote}. */
    CDNAnimated: (
      id: string,
      size?: number
    ) => string;
  };
  /** Bundled templates for different output formats. */
  Templates: {
    html: string;
    markdown: string;
    bbcode: string;
    plain: string;
  };
}

/* eslint-disable jsdoc/reject-function-type, jsdoc/reject-any-type */
declare class Collection<K, V> extends Map<K, V> {
  /**
   * Finds first matching value by property or function.
   * Same as `Array#find`.
   * @param {string|Function} propOrFunc - Property or function to test.
   * @param {any} [value] - Value to find.
   * @returns {any|null} - The found item or null if none found.
   */
  public find (
    propOrFunc: string | ((item: V, index: number, coll: this) => boolean),
    value?: any
  ): V

  /**
   * Filters cache by function.
   * Same as `Array#filter`.
   * @param {Function} func - Function to test.
   * @param {any} [thisArg] - The context for the function.
   * @returns {Collection} - A new collection with the filtered items.
   */
  public filter (
    func: (item: V, index: number, coll: this) => boolean
  ): Collection<K, V>

  /**
   * Maps cache by function.
   * Same as `Array#map`.
   * @param {Function} func - Function to use.
   * @param {any} [thisArg] - The context for the function.
   * @returns {any[]} - An array with the mapped items.
   */
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
