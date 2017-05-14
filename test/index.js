/* eslint-disable no-console */

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
    console.log(parser.parse(':PogChamp:\n:cirBaka:\n:SourPls:\n:theCutest:\n:AWOOO:'));
});
