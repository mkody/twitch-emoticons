# twitch-emoticons

Gets Twitch, BTTV, FFZ and 7TV emotes as well as parsing text to emotes!


## Migrate to 3.x

**This release introduces some breaking changes!**

<details>
<summary>Click here to toggle for details</summary>

### List of breaking changes from 2.x to 3.x

- Node.js 20 is required; we've set the minimum to 20.18.1.  
  *This library is now an ECMAScript module, so you can use proper `import {...} from '...'` imports.*
- The initialization of `EmoteFetcher` changed to only use an object as the first parameter for options.
  - API keys for Twitch must now be set with `twitchAppID` and `twitchAppSecret` properties.
  - The previously available `apiClient` is now set in this object too.
- The defaults for `EmoteParser` changed to use the `html` template, and it doesn't require `:colons:` by default (using `/(\w+)/` to match any words).
- The default `html` template doesn't have `twitch-emote-{size}` anymore in its `class` attribute.  
  *The `size` isn't consistent between the different sources, so it can't reliably be used.*
- The `EmoteFetcher.fetchSevenTVEmotes()`, `Emote.toLink()`, and `EmoteParse.parse()` methods now have their options as an object.
  - `fetcher.fetchSevenTVEmotes(null, { format: 'avif' })` - The first parameter is still the Twitch user ID (or `null` for global).
  - `emote.toLink({ size: 1, forceStatic: true, themeMode: 'light' })`
  - `parser.parse('Kappa', { size: 2, forceStatic: true, themeMode: 'dark' })` - The first parameter is still the input text.
- The `owner` getter for `Emote`s has been removed.  
  *It isn't reliable to get the `Channel` object, more so with 3rd-party providers since emotes might be owned by a channel that we never fetched (for shared/public emotes).*
- If you've exported 7TV emotes, do note that the `sizes` array changed to not include the leading `x.<format>`.
- **More may come for the final release, as this is still a work in progress.**


### Example of code changes

Our examples are running in an ESM-based project (`"type": "module"`).

We export a CommonJS-compatible build, so you can still use `require(...)`:  
```js
const { EmoteFetcher, EmoteParser } = require('@mkody/twitch-emoticons')
``` 


#### Before (2.x)

```js
import TwitchEmoticons from '@mkody/twitch-emoticons' // This actually still works, for compatibility's sake,
const { EmoteFetcher, EmoteParser } = TwitchEmoticons // but you should move away from this...

const fetcher = new EmoteFetcher('<your app ID>', '<your app secret>') // <- The first two parameters were for the Twitch app ID/secret

// Those next three lines didn't have breaking changes
await fetcher.fetchTwitchEmotes() // Do note that CommonJS doesn't handle `await` at the top level
const parser = new EmoteParser(fetcher)
const emote = emoteFetcher.emotes.get('Kappa')

console.log(emote.toLink(2)) // <- Only the size was available and was set as the first parameter
// https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0

console.log(parser.parse('Hello :CoolCat:!')) // <- Used colons and returned Markdown by default
// Hello ![CoolCat](https://static-cdn.jtvnw.net/emoticons/v2/58127/default/dark/1.0 "CoolCat")!
```


#### After (3.x)

```js
import { EmoteFetcher, EmoteParser } from '@mkody/twitch-emoticons' // <- Proper imports!

const fetcher = new EmoteFetcher({ // <- Uses an object!
  twitchAppID: '<your app ID>',
  twitchAppSecret: '<your app secret>',
})

// Those next three lines didn't have breaking changes
await fetcher.fetchTwitchEmotes()
const parser = new EmoteParser(fetcher)
const emote = emoteFetcher.emotes.get('Kappa')

console.log(emote.toLink({ size: 2 })) // <- Uses an object!
// https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0

console.log(parser.parse('Hello CoolCat!')) // <- Doesn't require :colons: and returns HTML by default!
// Hello <img alt="CoolCat" title="CoolCat" class="twitch-emote" src="https://static-cdn.jtvnw.net/emoticons/v2/58127/default/dark/1.0">
```

</details>


## Pre-requisites

To fetch Twitch emotes you need to [create an app here](https://dev.twitch.tv/console/apps/create), it's free.  
If you are only using BetterTTV, FrankerFaceZ and 7TV you don't need to provide Twitch app keys.

You must use a Twitch user ID instead of the username to fetch users' emotes.  
You can use [this page to manually convert them](https://s.kdy.ch/twitchid/).


## Install

```sh
npm install @mkody/twitch-emoticons
# or
pnpm add @mkody/twitch-emoticons
# or
yarn add @mkody/twitch-emoticons
# or
deno add npm:@mkody/twitch-emoticons
```

See this package on [npm] ([npmx]) or [jsr].

[npm]: https://www.npmjs.com/package/@mkody/twitch-emoticons
[npmx]: https://npmx.dev/package/@mkody/twitch-emoticons
[jsr]: https://jsr.io/@mkody/twitch-emoticons


## Examples

<details>
<summary>Click here to toggle the examples</summary>

### 1. Basic Twitch emote parsing

```js
import { EmoteFetcher, EmoteParser } from '@mkody/twitch-emoticons'

const fetcher = new EmoteFetcher({
  // Put your Twitch app keys here.
  twitchAppID: '<your app ID>',
  twitchAppSecret: '<your app secret>',
})
const parser = new EmoteParser(fetcher, {
  type: 'markdown',   // Can be `html` (default), `markdown`, `bbcode`, or `plain`.
                      // You can also set your own output, see example 3.
  match: /:(.+?):/g,  // This means your emotes must be between colons (:Kappa:).
                      // The default is /(\w+)/g and matches any word characters,
                      // similar to regular Twitch chat.
})

await fetcher.fetchTwitchEmotes(null) // `null` or a missing parameter will load "global" emotes.

const kappa = fetcher.emotes.get('Kappa').toLink()
console.log(kappa)
// https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/1.0

const text = 'Hello :CoolCat:!'
const parsed = parser.parse(text)
console.log(parsed)
// Hello ![CoolCat](https://static-cdn.jtvnw.net/emoticons/v2/58127/default/dark/1.0 "CoolCat")!
```


### 2. Bring your own `@twurple/api`

If you already use [Twurple](https://twurple.js.org/) in your project and manage authentification
(i.e. with user tokens), you can reuse it in this project by setting `apiClient` with your
[ApiClient](https://twurple.js.org/reference/api/classes/ApiClient.html) object.

```js
const fetcher = new EmoteFetcher({
  apiClient: yourOwnTwurpleApiClientHere,
})
```


### 3. All providers, global + channel, custom template and match pattern

```js
import { EmoteFetcher, EmoteParser } from '@mkody/twitch-emoticons'

// Your channel ID
const channelId = 44317909

const fetcher = new EmoteFetcher({
  twitchAppID: '<your app ID>',
  twitchAppSecret: '<your app secret>',
  forceStatic: false,
  twitchThemeMode: 'dark',
})
const parser = new EmoteParser(fetcher, {
  // Custom HTML format
  template: '<img class="emote" alt="{name}" src="{link}">',
  // Otherwise, just use our provided template
  // type: 'html',
  // Matches words (like \w) but also dashes
  match: /([a-zA-Z0-9_\-]+)/g,
})

Promise.all([
  // Twitch global
  fetcher.fetchTwitchEmotes(),
  // Twitch channel
  fetcher.fetchTwitchEmotes(channelId),
  // BTTV global
  fetcher.fetchBTTVEmotes(),
  // BTTV channel
  fetcher.fetchBTTVEmotes(channelId),
  // 7TV global
  fetcher.fetchSevenTVEmotes(),
  // 7TV channel
  fetcher.fetchSevenTVEmotes(channelId),
  // FFZ global
  fetcher.fetchFFZEmotes(),
  // FFZ channel
  fetcher.fetchFFZEmotes(channelId),
]).then(() => {
  const globalEmotes = parser.parse('EZ Clap way too easy LUL now for the last boss monkaS LaterSooner')
  console.log(globalEmotes)
  // <img class="emote" alt="EZ" src="https://cdn.7tv.app/emote/63071b80942ffb69e13d700f/1x.webp"> <img class="emote" alt="Clap" src="https://cdn.7tv.app/emote/62fc0a0c4a75fd54bd3520a9/1x.webp"> way too easy <img class="emote" alt="LUL" src="https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0"> now for the last boss <img class="emote" alt="monkaS" src="https://cdn.betterttv.net/emote/56e9f494fff3cc5c35e5287e/1x.webp"> <img class="emote" alt="LaterSooner" src="https://cdn.frankerfacez.com/emote/149346/1">

  const channelEmotes = parser.parse('KEKW that was 3Head TeriPoint')
  console.log(channelEmotes)
  // <img class="emote" alt="KEKW" src="https://cdn.betterttv.net/emote/5e9c6c187e090362f8b0b9e8/1x.webp"> that was <img class="emote" alt="3Head" src="https://cdn.frankerfacez.com/emote/274406/1"> <img class="emote" alt="TeriPoint" src="https://cdn.7tv.app/emote/61dc299b600369a98b38ebef/1x.webp">
}).catch((err) => {
  console.error('Error loading emotes...')
  console.error(err)
})
```


### 4. Force static images

All providers let you ask to only get static versions of their emotes.

By default, we allow animated emotes to be used,
but you can override this at the `EmoteFetcher` level:

```js
const fetcher = new EmoteFetcher({
  twitchAppID: '<your app ID>',
  twitchAppSecret: '<your app secret>',
  forceStatic: true, // <- Here!
})

await fetcher.fetchTwitchEmotes()
const dinoDance = fetcher.emotes.get('DinoDance').toLink()
console.log(dinoDance)
// https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dcd06b30a5c24f6eb871e8f5edbd44f7/static/dark/1.0
```

> **NOTE:**  
> *Q:* Why set this to the `EmoteFetcher` and not `EmoteParser`?  
> *A:* Because `Emote.toLink()` (that you get from the fetcher) uses that info!

It is also possible to force that using the `Emote`'s `toLink()` method:

```js
const dinoDance = fetcher.emotes.get('DinoDance').toLink({ forceStatic: true })
console.log(dinoDance)
// https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dcd06b30a5c24f6eb871e8f5edbd44f7/static/dark/1.0
```

Or when using the `EmoteParser`'s `parse()`:

```js
const dinoDance = parser.parse('DinoDance', { forceStatic: true })
console.log(dinoDance)
// <img alt="DinoDance" title="DinoDance" class="twitch-emote" src="https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dcd06b30a5c24f6eb871e8f5edbd44f7/static/dark/1.0">
```

> **WARNING:**  
> Forcing static images might make the `imageType` of the `Emote` not match with your expectations!  
> (Twitch: `gif` => `png`; BTTV: `webp` => `png`.)


### 5. Twitch "theme mode" preference

Some Twitch emotes are optimized for light or dark backgrounds.

By default, emotes are fetched for dark backgrounds,
but you can specify a preference at the `EmoteFetcher` level:

```js
// For dark backgrounds (default)
const fetcherDark = new EmoteFetcher({
  twitchAppID: '<your app ID>',
  twitchAppSecret: '<your app secret>',
  twitchThemeMode: 'dark', // <- Here!
})

// For light backgrounds
const fetcherLight = new EmoteFetcher({
  twitchAppID: '<your app ID>',
  twitchAppSecret: '<your app secret>',
  twitchThemeMode: 'light', // <- Here!
})

await fetcherLight.fetchTwitchEmotes()
const kappa = fetcherLight.emotes.get('Kappa').toLink()
console.log(kappa)
// https://static-cdn.jtvnw.net/emoticons/v2/25/default/light/1.0
```

> **NOTE:**  
> *Q:* Why set this to the `EmoteFetcher` and not `EmoteParser`?  
> *A:* Because `Emote.toLink()` (that you get from the fetcher) uses that info!

It is also possible to force that using the `Emote`'s `toLink()` method:

```js
const kappa = fetcher.emotes.get('Kappa').toLink({ themeMode: 'light' })
console.log(kappa)
// https://static-cdn.jtvnw.net/emoticons/v2/25/default/light/1.0
```

Or when using the `EmoteParser`'s `parse()`:

```js
const kappa = parser.parse('Kappa', { themeMode: 'light' })
console.log(kappa)
// <img alt="Kappa" title="Kappa" class="twitch-emote" src="https://static-cdn.jtvnw.net/emoticons/v2/25/default/light/1.0">
```


### 6. 7TV formats

7TV v3 delivers emotes in either WEBP or AVIF.

By default we'll return WEBP emotes but you can override this.

```js
// Fetch global emotes in AVIF (channel id has to be `null` for global)
await fetcher.fetchSevenTVEmotes(null, { format: 'avif' })

// Fetch 0kody's emotes with the package's default format (WEBP)
await fetcher.fetchSevenTVEmotes(44317909)

// ... which is currently the same as
await fetcher.fetchSevenTVEmotes(44317909, { format: 'webp' })

// Fetch Anatole's emotes in AVIF
await fetcher.fetchSevenTVEmotes(24377667, { format: 'avif' })
```


### 7. Export and import emote data

This can be useful to save the emotes in a cache or for offline content.

```js
// First fetch some emotes
await fetcher.fetchSevenTVEmotes(null, { format: 'avif' })

// Then you can use .toObject() on an `Emote` to export its data.
// Here's a map to get them all in a single array.
const emotes = fetcher.emotes.map((emote) => emote.toObject())

// Later, with or without a fresh `EmoteFetcher`, you can use .fromObject() on the fetcher.
fetcher.fromObject(emotes)
```

> **NOTE:**  
> For offline content, you'll still need to download emotes and proxy their URLs.

</details>


## Links

- [Github](https://github.com/mkody/twitch-emoticons)
- [Documentation](https://mkody.github.io/twitch-emoticons/)
- [Changelog](https://github.com/mkody/twitch-emoticons/releases)

This library uses the following:
- [Twurple](https://twurple.js.org/) and the [Twitch API](https://dev.twitch.tv/)
- [BetterTTV API](https://betterttv.com/developers/api)
- [FrankerFaceZ API](https://api.frankerfacez.com/docs/)
- [7TV API](https://7tv.io/)
