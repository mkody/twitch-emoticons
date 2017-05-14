/// <reference path='index.d.ts' />

import { EmoteFetcher, EmoteParser, TwitchEmote } from 'twitch-emoticons';

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
    if (kappa instanceof TwitchEmote) {
        console.log(kappa.description);
    }

    const parsed = parser.parse('Hello world :Kappa:');
    console.log(parsed);
});
