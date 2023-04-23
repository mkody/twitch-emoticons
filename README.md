## WARNING

The `fork` branch you're on is no longer supported, **[please switch to master](https://github.com/mkody/twitch-emoticons/tree/master)**.

---

# twitch-emoticons

Gets Twitch, BTTV, FFZ and 7TV emotes as well as parsing text to emotes!

### Migrating from upstream
You must now use a Twitch user ID instead of the username to fetch user's emotes.  
You can use [this page to quickly grab it](https://s.kdy.ch/twitchid/).

To fetch Twitch emotes you need to get a client and secret from Twitch [here](https://dev.twitch.tv/console/apps/create), it's free.  
If you are only using BetterTTV, FrankerFaceZ and 7TV you don't need to provide Twitch app keys as they are independent from the Twitch API.

### Install
```sh
npm install @mkody/twitch-emoticons
# or
yarn add @mkody/twitch-emoticons
```

### Examples

#### Basic Twitch emote parsing

```js
// With ESM import
import TwitchEmoticons from '@mkody/twitch-emoticons';
const { EmoteFetcher, EmoteParser } = TwitchEmoticons;
// ... or require()
const { EmoteFetcher, EmoteParser } = require('@mkody/twitch-emoticons');

// Your Twitch app keys
const clientId = '<your client id>';
const clientSecret = '<your client secret>';

const fetcher = new EmoteFetcher(clientId, clientSecret);
const parser = new EmoteParser(fetcher, {
    type: 'markdown',
    match: /:(.+?):/g
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

#### All providers, global + channel, custom template and match pattern

```js
const { EmoteFetcher, EmoteParser } = require('@mkody/twitch-emoticons');

// Your channel ID
const channelId = 44317909;

// Your Twitch app keys
const clientId = '<your client id>';
const clientSecret = '<your client secret>';

const fetcher = new EmoteFetcher(clientId, clientSecret);
const parser = new EmoteParser(fetcher, {
    template: '<img class="emote" alt="{name}" src="{link}">', // Custom HTML format
    match: /(\w+)+?/g // Match without :colons:
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
    // FFZ channel
    fetcher.fetchFFZEmotes(channelId)
]).then(() => {
    const globalEmotes = parser.parse('EZ Clap way too easy LUL now for the last bost monkaS');
    console.log(globalEmotes);
    // <img class="emote" alt="EZ" src="https://cdn.7tv.app/emote/6320bf2ad461b9ebf9413812/1x.webp"> <img class="emote" alt="Clap" src="https://cdn.7tv.app/emote/636b877aada75990352334c7/1x.webp"> way too easy <img class="emote" alt="LUL" src="https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0"> now for the last bost <img class="emote" alt="monkaS" src="https://cdn.betterttv.net/emote/56e9f494fff3cc5c35e5287e/1x">

    const channelEmotes = parser.parse('KEKW that was 3Head TeriPoint');
    console.log(channelEmotes);
    // <img class="emote" alt="KEKW" src="https://cdn.betterttv.net/emote/5e9c6c187e090362f8b0b9e8/1x"> that was <img class="emote" alt="3Head" src="https://cdn.frankerfacez.com/emote/274406/1"> <img class="emote" alt="TeriPoint" src="https://cdn.7tv.app/emote/61dc299b600369a98b38ebef/1x.webp">
}).catch(err => {
    console.error('Error loading emotes...');
    console.error(err);
});
```

#### 7TV formats

7TV v3 delivers emotes in either WEBP or AVIF.  
By default we'll return WEBP emotes but you can override this.

```js
const { EmoteFetcher } = require('@mkody/twitch-emoticons');
const fetcher = new EmoteFetcher();

// Fetch global emotes in AVIF (channel id has to be `null` for global)
fetcher.fetchSevenTVEmotes(null, 'avif');

// Fetch 0kody's emotes with the package's default format (WEBP)
fetcher.fetchSevenTVEmotes(44317909);

// ... which is currently the same as
fetcher.fetchSevenTVEmotes(44317909, 'webp');

// Fetch Anatole's emotes in AVIF
fetcher.fetchSevenTVEmotes(24377667, 'avif');
```

### Links

- [Github](https://github.com/mkody/twitch-emoticons)
- [Documentation](https://mkody.github.io/twitch-emoticons/)
- [Changelog](https://github.com/mkody/twitch-emoticons/releases)

This library uses the following:
- [BetterTTV API](https://betterttv.com/)
- [FrankerFaceZ API](https://www.frankerfacez.com/developers)
- [7TV API](https://7tv.app/)
