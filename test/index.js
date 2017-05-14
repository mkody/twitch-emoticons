/* eslint-disable no-console */

const assert = require('assert');
const { EmoteFetcher, EmoteParser } = require('../src/index.js');

const fetcher = new EmoteFetcher();
const parser = new EmoteParser(fetcher, {
    type: 'markdown',
    match: /:(.+?):/g
});

Promise.all([
    fetcher.fetchTwitchEmotes(),
    fetcher.fetchBTTVEmotes(),
    fetcher.fetchBTTVEmotes('11computer'),
    fetcher.fetchFFZEmotes('sylux98')
]).then(() => {
    const kappa = fetcher.emotes.get('Kappa');
    assert(kappa.toLink(2), 'https://static-cdn.jtvnw.net/emoticons/v1/25/3.0');

    const text = parser.parse(':PogChamp:\n:cirBaka:\n:SourPls:\n:theCutest:\n:AWOOO:');
    assert(text, [
        '![PogChamp](https://static-cdn.jtvnw.net/emoticons/v1/88/1.0 "PogChamp")',
        '![cirBaka](https://static-cdn.jtvnw.net/emoticons/v1/106276/1.0 "cirBaka")',
        '![SourPls](https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/1x "SourPls")',
        '![theCutest](https://cdn.betterttv.net/emote/57adce4525cb03b67237d226/1x "theCutest")',
        '![AWOOO](https://cdn.frankerfacez.com/emoticon/67/1 "AWOOO")'
    ].join('\n'));
}).catch(err => {
    console.error('Test failed!');
    console.error(err);
});
