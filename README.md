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

### Example

```js
const { EmoteFetcher, EmoteParser } = require('@mkody/twitch-emoticons');

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

### Links

- [Github](https://github.com/mkody/twitch-emoticons)
- [Documentation](https://mkody.github.io/twitch-emoticons/)
- [Changelog](https://github.com/mkody/twitch-emoticons/releases)

This library uses the following:
- [BetterTTV API](https://betterttv.com/)
- [FrankerFaceZ API](https://www.frankerfacez.com/developers)
- [7TV API](https://7tv.app/)
