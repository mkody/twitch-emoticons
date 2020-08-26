# twitch-emoticons

Get a Twitch channel's Twitch emotes, BTTV emotes, and FFZ emotes!

### Install
```sh
npm install @mkody/twitch-emoticons`
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

    const text = 'Hello :PogChamp:!';
    const parsed = parser.parse(text);
    console.log(parsed);
    // Hello ![PogChamp](https://static-cdn.jtvnw.net/emoticons/v1/88/1.0 "PogChamp")!
});
```

### Links

- [Github](https://github.com/mkody/twitch-emoticons)
- [Documentation](https://mkody.github.io/twitch-emoticons/)
- [Changelog](https://github.com/mkody/twitch-emoticons/releases)

This library uses the following:
- [Twitch Emotes API](https://twitchemotes.com/apidocs)
- [BetterTTV API](https://api.betterttv.net/)
- [FrankerFaceZ API](http://www.frankerfacez.com/developers)
