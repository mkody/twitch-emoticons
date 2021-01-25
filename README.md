# twitch-emoticons

Get a Twitch channel's Twitch emotes, BTTV emotes, and FFZ emotes!

### About this fork's 2.3.0+
You must now use a Twitch user ID instead of the username to fetch user's emotes.  
You can use [this page to quickly grab it](https://s.kdy.ch/twitchid/).

_FFZ still supports names, but usage of the ID is recommended._

### Install
```sh
npm install @mkody/twitch-emoticons
# or
yarn add @mkody/twitch-emoticons
```

### Example

```js
const { EmoteFetcher, EmoteParser } = require('twitch-emoticons');

const fetcher = new EmoteFetcher();
const parser = new EmoteParser(fetcher, {
    type: 'markdown',
    match: /:(.+?):/g
});

fetcher.fetchTwitchEmotes(null).then(() => {
    const kappa = fetcher.emotes.get('Kappa').toLink();
    console.log(kappa);
    // https://static-cdn.jtvnw.net/emoticons/v1/25/1.0

    const text = 'Hello :CoolCat:!';
    const parsed = parser.parse(text);
    console.log(parsed);
    // Hello ![CoolCat](https://static-cdn.jtvnw.net/emoticons/v1/58127/1.0 "CoolCat")!
});
```

### Links

- [Github](https://github.com/mkody/twitch-emoticons)
- [Documentation](https://mkody.github.io/twitch-emoticons/)
- [Changelog](https://github.com/mkody/twitch-emoticons/releases)

This library uses the following:
- [Twitch Emotes API](https://twitchemotes.com/apidocs)
- [BetterTTV API](https://betterttv.com/)
- [FrankerFaceZ API](http://www.frankerfacez.com/developers)
