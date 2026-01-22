# twitch-emoticons

Gets Twitch, BTTV, FFZ and 7TV emotes as well as parsing text to emotes!


### 3.x notes

This release introduces some breaking changes!

- Node 20 is required, we've set the minimum to 20.19.
- This project uses ESM imports. Begone `require(...)`, welcome `import {...} from '...'`.
- *More to come for the final release, as this is still a work in progress.*


### Pre-requisites

To fetch Twitch emotes you need to get a client and secret from Twitch [here](https://dev.twitch.tv/console/apps/create), it's free.  
If you are only using BetterTTV, FrankerFaceZ and 7TV you don't need to provide Twitch app keys, as they are independent from the Twitch API.

You must use a Twitch user ID instead of the username to fetch users' emotes.  
You can use [this page to quickly grab them from a username](https://s.kdy.ch/twitchid/).


### Install

```sh
npm install @mkody/twitch-emoticons
# or
pnpm install @mkody/twitch-emoticons
# or
yarn add @mkody/twitch-emoticons
```


### Examples

#### Basic Twitch emote parsing

```js
import { EmoteFetcher, EmoteParser } from '@mkody/twitch-emoticons';

// Your Twitch app keys
const clientId = '<your client id>';
const clientSecret = '<your client secret>';

const fetcher = new EmoteFetcher(clientId, clientSecret);
const parser = new EmoteParser(fetcher, {
    type: 'markdown', // Can be `markdown` (default), `html`, `bbcode`, or `plain`.
    match: /:(.+?):/g // This is the default, which means your emotes must be between colons (:Kappa:).
                      // Use /(\w+)+?/g to check on every word, like in regular Twitch chat.
});

fetcher.fetchTwitchEmotes(null).then(() => {
    const kappa = fetcher.emotes.get('Kappa').toLink();
    console.log(kappa);
    // https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/1.0

    const text = 'Hello :CoolCat:!';
    const parsed = parser.parse(text);
    console.log(parsed);
    // Hello ![CoolCat](https://static-cdn.jtvnw.net/emoticons/v2/58127/default/dark/1.0 "CoolCat")!
});
```


#### Bring your own `@twurple/api`

If you already use [Twurple](https://twurple.js.org/) in your project and manage authentification
(i.e. with user tokens), you can reuse it in this project by skipping the first two paramters and
setting `apiClient` with your [ApiClient](https://twurple.js.org/reference/api/classes/ApiClient.html) object.

```js
const fetcher = new EmoteFetcher(null, null, {
    apiClient: yourOwnTwurpleApiClientHere
});
```


#### All providers, global + channel, custom template and match pattern

```js
import { EmoteFetcher, EmoteParser } from '@mkody/twitch-emoticons';

// Your channel ID
const channelId = 44317909;

// Your Twitch app keys
const clientId = '<your client id>';
const clientSecret = '<your client secret>';

const fetcher = new EmoteFetcher(clientId, clientSecret);
const parser = new EmoteParser(fetcher, {
    // Custom HTML format
    template: '<img class="emote" alt="{name}" src="{link}">',
    // Match without :colons:
    match: /(\w+)+?/g
});

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
    fetcher.fetchFFZEmotes(channelId)
]).then(() => {
    const globalEmotes = parser.parse('EZ Clap way too easy LUL now for the last boss monkaS LaterSooner');
    console.log(globalEmotes);
    // <img class="emote" alt="EZ" src="https://cdn.7tv.app/emote/63071b80942ffb69e13d700f/1x.webp"> <img class="emote" alt="Clap" src="https://cdn.7tv.app/emote/62fc0a0c4a75fd54bd3520a9/1x.webp"> way too easy <img class="emote" alt="LUL" src="https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0"> now for the last boss <img class="emote" alt="monkaS" src="https://cdn.betterttv.net/emote/56e9f494fff3cc5c35e5287e/1x.webp"> <img class="emote" alt="LaterSooner" src="https://cdn.frankerfacez.com/emote/149346/1">

    const channelEmotes = parser.parse('KEKW that was 3Head TeriPoint');
    console.log(channelEmotes);
    // <img class="emote" alt="KEKW" src="https://cdn.betterttv.net/emote/5e9c6c187e090362f8b0b9e8/1x.webp"> that was <img class="emote" alt="3Head" src="https://cdn.frankerfacez.com/emote/274406/1"> <img class="emote" alt="TeriPoint" src="https://cdn.7tv.app/emote/61dc299b600369a98b38ebef/1x.webp">
}).catch(err => {
    console.error('Error loading emotes...');
    console.error(err);
});
```


#### Twitch background color preference

Twitch emotes can be optimized for light or dark backgrounds.  
By default, emotes are fetched for dark backgrounds, but you can specify a preference:

```js
import { EmoteFetcher, EmoteParser } from '@mkody/twitch-emoticons';

// For dark backgrounds (default)
const fetcherDark = new EmoteFetcher(clientId, clientSecret, {
    twitchBackgroundColor: 'dark'
});

// For light backgrounds
const fetcherLight = new EmoteFetcher(clientId, clientSecret, {
    twitchBackgroundColor: 'light'
});

fetcherLight.fetchTwitchEmotes(null).then(() => {
    const kappa = fetcherLight.emotes.get('Kappa').toLink();
    console.log(kappa);
    // https://static-cdn.jtvnw.net/emoticons/v2/25/default/light/1.0
});
```

It is also possible to pick the prefered background color when using
the `Emote`'s `toLink()` method:

```js
const fetcher = new EmoteFetcher(clientId, clientSecret);
fetcher.fetchTwitchEmotes(null).then(() => {
    // Do note that the first parameter is the size, so either set `null` or use it properly
    const kappa = fetcher.emotes.get('Kappa').toLink(null, 'light');
    console.log(kappa);
    // https://static-cdn.jtvnw.net/emoticons/v2/25/default/light/1.0
});
```

Or when using the `EmoteParser`'s `parse()`:
```js
// Do note that the second parameter is the size, so either set `null` or use it properly
const kappa = parser.parse('Kappa', null, 'light');
console.log(kappa);
// ![Kappa](https://static-cdn.jtvnw.net/emoticons/v2/25/default/light/1.0 "Kappa")!
```


#### 7TV formats

7TV v3 delivers emotes in either WEBP or AVIF.  
By default we'll return WEBP emotes but you can override this.

```js
import { EmoteFetcher } from '@mkody/twitch-emoticons';
const fetcher = new EmoteFetcher();

// Fetch global emotes in AVIF (channel id has to be `null` for global)
await fetcher.fetchSevenTVEmotes(null, 'avif');

// Fetch 0kody's emotes with the package's default format (WEBP)
await fetcher.fetchSevenTVEmotes(44317909);

// ... which is currently the same as
await fetcher.fetchSevenTVEmotes(44317909, 'webp');

// Fetch Anatole's emotes in AVIF
await fetcher.fetchSevenTVEmotes(24377667, 'avif');
```


#### Export and import emote data

This can be useful to save the emotes in a cache or for offline content.  
(For offline content, you'll still need to download emotes and proxy their URLs.)

```js
import { EmoteFetcher } from '@mkody/twitch-emoticons';
const fetcher = new EmoteFetcher();

// First fetch some emotes
await fetcher.fetchSevenTVEmotes(null, 'avif');

// Then you can use .toObject() on an `Emote` to export its data.
// Here's a map to get them all in a single array.
const emotes = fetcher.emotes.map(emote => emote.toObject());

// Later, with or without a fresh `EmoteFetcher`, you can use .fromObject() on the fetcher.
fetcher.fromObject(emotes);
```


### Links

- [Github](https://github.com/mkody/twitch-emoticons)
- [Documentation](https://mkody.github.io/twitch-emoticons/)
- [Changelog](https://github.com/mkody/twitch-emoticons/releases)

This library uses the following:
- [Twurple](https://twurple.js.org/) and the [Twitch API](https://dev.twitch.tv/)
- [BetterTTV API](https://betterttv.com/developers/api)
- [FrankerFaceZ API](https://api.frankerfacez.com/docs/)
- [7TV API](https://7tv.io/)
