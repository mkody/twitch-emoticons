# twitch-emoticons

Gets Twitch, BTTV, FFZ and 7TV emotes as well as parsing text to emotes!

> [!IMPORTANT]  
> This branch is for the **currently pre-released** 3.0 version.  
> If you want to see the latest stable version (as of this commit),
> [switch to the `version/2.9` branch](https://github.com/mkody/twitch-emoticons/tree/version/2.9).


## Migrate to 3.x

**This release introduces breaking changes!**

<details>
<summary>Click here to toggle for details</summary>

### List of breaking changes from 2.x to 3.x

- Node.js 20 is required; we have set the minimum to 20.18.1.  
  *This library is now an ECMAScript module, so you can use proper `import {...} from '...'` imports.*
- The initialization of `EmoteFetcher` changed to only use an object as the first parameter for options.
  - API keys for Twitch must now be set with `twitchAppID` and `twitchAppSecret` properties.
  - The previously available `apiClient` is now set in this object too.
- The defaults for `EmoteParser` changed to use the `html` template, and it does not require `:colons:` by default (using `/(\w+)/` to match any words).
- The default `html` template does not have `twitch-emote-{size}` anymore in its `class` attribute.  
  *The `size` is inconsistent between the different sources, so it cannot be reliably used.*
- If you somehow used `EmoteFetcher.globalChannel`, it has now been removed.  
  *Directly use `EmoteFetcher.channels.get(null)` instead.*
- The `EmoteFetcher.fetchSevenTVEmotes()`, `Emote.toLink()`, and `EmoteParse.parse()` methods now have their options as an object.
  - `fetcher.fetchSevenTVEmotes(null, { format: 'avif' })` - The first parameter is still the Twitch user ID (or `null` for global).
  - `emote.toLink({ size: 1, forceStatic: true, themeMode: 'light' })`
  - `parser.parse('Kappa', { size: 2, forceStatic: true, themeMode: 'dark' })` - The first parameter is still the input text.
- The `owner` getter for `Emote`s has been removed.  
  *It is not reliable to get the `Channel` object, more so with 3rd-party providers since emotes might be owned by a channel that we never fetched (for shared/public emotes).*
- If you have exported 7TV emotes, do note that the `sizes` array changed to not include the leading `x.<format>`.  
  *The rest of the export/import is still compatible with the current implementation.*


### Example of code changes

Our examples are running in an ESM-based project (`"type": "module"`).  
Do note that we export a CommonJS-compatible build, so you can still use `require(...)`:  
```js
const { EmoteFetcher, EmoteParser } = require('@mkody/twitch-emoticons')
``` 


#### Before (2.x)

```js
import TwitchEmoticons from '@mkody/twitch-emoticons' // This actually still works, for compatibility's sake,
const { EmoteFetcher, EmoteParser } = TwitchEmoticons // but you should move away from this...

const fetcher = new EmoteFetcher('<your app ID>', '<your app secret>') // <- The first two parameters were for the Twitch app ID/secret

// Those next three lines do not have breaking changes
await fetcher.fetchTwitchEmotes() // Do note that CommonJS does not handle `await` at the top level
const parser = new EmoteParser(fetcher)
const emote = emoteFetcher.emotes.get('Kappa')

console.log(emote.toLink(2)) // <- Only the size was available and set as the first parameter
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

// Those next three lines do not have breaking changes
await fetcher.fetchTwitchEmotes()
const parser = new EmoteParser(fetcher)
const emote = emoteFetcher.emotes.get('Kappa')

console.log(emote.toLink({ size: 2 })) // <- Uses an object!
// https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0

console.log(parser.parse('Hello CoolCat!')) // <- Does not require :colons: and returns HTML by default!
// Hello <img alt="CoolCat" title="CoolCat" class="twitch-emote" src="https://static-cdn.jtvnw.net/emoticons/v2/58127/default/dark/1.0">
```

</details>


## Prerequisites

To fetch "native" emotes from Twitch.tv, you need to [create an app here](https://dev.twitch.tv/console/apps/create), it is free.  
If you are only using BetterTTV, FrankerFaceZ and 7TV you do not need to provide Twitch app keys.

You must use a Twitch user ID instead of the username to fetch users' emotes.  
If you just need to get one or a very few, you can [use this page to manually convert them](https://s.kdy.ch/twitchid/) (please do not automate/abuse it).


## Install

From [npm] ([browse on npmx]; use the `@next` tag):

```sh
npm install @mkody/twitch-emoticons@next
# or
pnpm add @mkody/twitch-emoticons@next
# or
yarn add @mkody/twitch-emoticons@next
# or
deno add npm:@mkody/twitch-emoticons@next
```

From [jsr]:

```sh
npx jsr add @mkody/twitch-emoticons
# or
pnpm add jsr:@mkody/twitch-emoticons
# or
yarn add jsr:@mkody/twitch-emoticons
# or (version has to be specified while it is a pre-release)
deno add jsr:@mkody/twitch-emoticons@3.0.0-beta.4
```

[npm]: https://www.npmjs.com/package/@mkody/twitch-emoticons/v/3.0.0-beta.4
[browse on npmx]: https://npmx.dev/package/@mkody/twitch-emoticons/v/3.0.0-beta.4
[jsr]: https://jsr.io/@mkody/twitch-emoticons@3.0.0-beta.4


## Quick docs

<details>
<summary>Click here to toggle the docs</summary>

Here is some quick documentation to explain our two classes, the principal methods, and some settings.

> **NOTE:**  
> If you want a more complete documentation, see: https://mkody.github.io/twitch-emoticons/


### Grab emotes with `EmoteFetcher`

First, you need to load a list of emotes, and for that you create a new `EmoteFetcher` object:

```js
const fetcher = new EmoteFetcher({
  // If you want to use emotes from twitch.tv, you will need to be authenticated to use their API.
  // Option 1: Provide your app ID and secret here (get them at https://dev.twitch.tv/console/apps).
  twitchAppID,      // <string>
  twitchAppSecret,  // <string>
  // Option 2: If you need a different way to auth or already use `@twurple/api`,
  //           you can provide your ApiClient object here.
  apiClient, // <ApiClient>

  // Force emotes to be static (non-animated).
  forceStatic, // <boolean> - Default: false

  // Theme mode (background color) preference for Twitch emotes.
  twitchThemeMode, // <'dark' | 'light'> - Default: 'dark'
})
```

And then you need to make the calls to load what you want.

There is one method per platform; all of them return Promises (so you can use `await` or callback chains):

- `fetcher.fetchTwitchEmotes()`
- `fetcher.fetchBTTVEmotes()`
- `fetcher.fetchFFZEmotes()`
- `fetcher.fetchSevenTVEmotes()`

The first parameter is the Twitch user ID of the channel you want to load emotes from.  
If not provided or it is `null`/falsy, it loads what we call "global emotes", which are available to all users of the platform.

Do note that `fetchSevenTVEmotes()` accepts a second parameter with an object:

- `format`: Set the image type used, either `webp` or `avif`. Default: `webp`

So if you want to load all global emotes, you can do it that way:

```js
await fetcher.fetchTwitchEmotes()
await fetcher.fetchBTTVEmotes()
await fetcher.fetchFFZEmotes()
await fetcher.fetchSevenTVEmotes(null, { format: 'avif' }) // Example of loading images in AVIF here
```

With the emotes now fetched, you can look them up!  
To grab a specific emote, you can do `fetcher.emotes.get('...')`, with the case-sensitive name of the emote in place of the ellipsis.  
From there, you can read properties like `.id`, `.code`, `.ownerName`,
`.animated`, `.imageType`, or `.type`, but you can also use the `.toLink()`
method to… get a link!

> Note: Some extended `Emote`s have additional properties:
> - FFZ:
>   - `.zeroWidth` (boolean, can overlay an another emote)
>   - `.modifier` (boolean, emote effects, should be hidden)
> - 7TV:
>   - `.zeroWidth` (boolean, can overlay an another emote)
>   - `.nsfw` (boolean, flagged "Sexual" or "Twitch disallowed")


### Parse strings to include emotes with `EmoteParser`

And now that we have our list of emotes that we can expect to find, we should use it.  
Create an `EmoteParser` object:

```js
const parser = new EmoteParser(
  // The first parameter is our EmoteFetcher, the object that holds the list of fetched emotes.
  fetcher, // <EmoteFetcher>

  // The second parameter is an *optional* object with settings.
  {
    // What output should be used when you parse messages? There are two ways to set that up:
    // Option 1: Use one of the provided templates:
    // - 'html': `<img alt="{name}" title="{name}" class="twitch-emote" src="{link}">`
    // - 'markdown': `![{name}]({link} "{name}")`
    // - 'bbcode': `[img]{link}[/img]`
    // - 'plain': `{link}`
    type, // <'html' | 'markdown' | 'bbcode' | 'plain'> - Default: 'html'
    // Option 2: Make your own template; this has priority over option 1.
    // You can use those: `{link}`, `{name}`, `{size}`, `{creator}`,
    //                    `{is-animated}`, `{is-nsfw}`, `{is-zero-width}`.
    template, // <string> - Default: ''

    // You can customize the regular expression used to find possible emotes.
    match, // <RegExp> - Default: /(\w+)/g
  },
) 
```

And now, we can parse text and get the output as set by `type` or `template`, using the `parser.parse()` method.  
Just pass the input text as the first parameter. There is also an optional second parameter
where you can provide a few settings (which can overwrite the same ones set in the `EmoteFetcher`).

```js
const parsed = parser.parse(
  // The text to parse.
  text, // <string>

  // The second parameter is an *optional* object with the settings.
  {
    // Size (scale) for emotes.
    // It varies by provider, and not all share the same resolution in pixels.
    // Play with this value if you would like, but no guarantees!
    size, // <number>

    // Force emotes to be static (non-animated).
    forceStatic, // <boolean> - Default: value in EmoteFetcher or false

    // Theme mode (background color) preference for Twitch emotes.
    twitchThemeMode // <'dark' | 'light'> - Default: value in EmoteFetcher or 'dark'
  },
)
```

And that is it for the essentials!  
You can go through the examples below if you need to see more complete code and direct usage.

</details>


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

If you already use [Twurple](https://twurple.js.org/) in your project and manage authentication
(i.e., with user tokens), you can reuse it in this project by setting `apiClient` with your
[ApiClient](https://twurple.js.org/reference/api/classes/ApiClient.html) object.

```js
import { ApiClient } from '@twurple/api'
import { StaticAuthProvider } from '@twurple/auth'
import { EmoteFetcher } from '@mkody/twitch-emoticons'

const authProvider = new StaticAuthProvider('<your app ID>', '<access token>')
const myCustomApiClient = new ApiClient({ authProvider })

const fetcher = new EmoteFetcher({
  apiClient: myCustomApiClient,
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
  template: `
    <img
      class="emote"
      alt="{name}"
      src="{link}"
      data-scale="{size}"
      data-animated="{is-animated}"
      data-overlay="{is-zero-width}"
      data-nsfw="{is-nsfw}"
    >`,
  // Matches words (like \w) but also dashes
  match: /([a-zA-Z0-9_\-]+)/g,
})

// Fetch all the emotes we want and wait for everything to complete
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
])
  .then(() => {
    const globalEmotes = parser.parse('EZ Clap way too easy LUL now for the last boss monkaS LaterSooner')
    console.log(globalEmotes)
    // <img class="emote" alt="EZ" src="https://cdn.7tv.app/emote/63071b80942ffb69e13d700f/1x.webp"> <img class="emote" alt="Clap" src="https://cdn.7tv.app/emote/62fc0a0c4a75fd54bd3520a9/1x.webp"> way too easy <img class="emote" alt="LUL" src="https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0"> now for the last boss <img class="emote" alt="monkaS" src="https://cdn.betterttv.net/emote/56e9f494fff3cc5c35e5287e/1x.webp"> <img class="emote" alt="LaterSooner" src="https://cdn.frankerfacez.com/emote/149346/1">

    const channelEmotes = parser.parse('KEKW that was 3Head TeriPoint')
    console.log(channelEmotes)
    // <img class="emote" alt="KEKW" src="https://cdn.betterttv.net/emote/5e9c6c187e090362f8b0b9e8/1x.webp"> that was <img class="emote" alt="3Head" src="https://cdn.frankerfacez.com/emote/274406/1"> <img class="emote" alt="TeriPoint" src="https://cdn.7tv.app/emote/61dc299b600369a98b38ebef/1x.webp">
  })
  .catch((err) => {
    console.error('Error loading emotes...')
    console.error(err)
  })
```


### 4. Force static images

All providers let you ask to only get static versions of their emotes.

By default, we allow animated emotes to be used,
but you can override this at the `EmoteFetcher` level:

```js
import { EmoteFetcher } from '@mkody/twitch-emoticons'

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
import { EmoteFetcher } from '@mkody/twitch-emoticons'

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

7TV delivers emotes in either WEBP or AVIF.

By default we will return WEBP emotes, but you can override this.

```js
// (setup)
import { EmoteFetcher } from '@mkody/twitch-emoticons'
const fetcher = new EmoteFetcher()

// Fetch global emotes in AVIF (channel id has to be `null` for global)
await fetcher.fetchSevenTVEmotes(null, { format: 'avif' })

// Fetch 0kody's emotes with the package's default format (WEBP)
await fetcher.fetchSevenTVEmotes(44317909)

// ... which is currently the same as
await fetcher.fetchSevenTVEmotes(44317909, { format: 'webp' })

// Fetch Nerixyz's emotes in AVIF
await fetcher.fetchSevenTVEmotes(129546453, { format: 'avif' })
```


### 7. Export and import emote data

This can be useful to save the emotes in a cache or for offline access.

```js
// (setup)
import { EmoteFetcher } from '@mkody/twitch-emoticons'
const fetcher = new EmoteFetcher()

// First fetch some emotes
await fetcher.fetchSevenTVEmotes(null, { format: 'avif' })

// Then you can use .toObject() on an `Emote` to export its data.
// Here is a map to get them all in a single array.
const emotes = fetcher.emotes.map((emote) => emote.toObject())

// Later, with or without a fresh `EmoteFetcher`, you can use .fromObject() on the fetcher.
fetcher.fromObject(emotes)
```

> **NOTE:**  
> For offline access, you will still need to download emotes and proxy their URLs.

</details>


## Links

- [Github](https://github.com/mkody/twitch-emoticons)
- [Documentation](https://mkody.github.io/twitch-emoticons/)
- [Changelog](https://github.com/mkody/twitch-emoticons/releases)

This library uses the following:

- [Twurple](https://twurple.js.org/) and the [Twitch API](https://dev.twitch.tv/)
- [BetterTTV API](https://betterttv.com/developers/api)
- [FrankerFaceZ API](https://api.frankerfacez.com/docs/)
- [7TV API (v3 via GraphQL)](https://github.com/SevenTV/SevenTV/tree/main/apps/api/src/http/v3/gql)
