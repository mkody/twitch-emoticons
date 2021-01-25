/* eslint-disable no-console */

const assert = require('assert');
const { EmoteFetcher, EmoteParser } = require('../src/index.js');

const fetcher = new EmoteFetcher();
const parser = new EmoteParser(fetcher, {
    type: 'markdown',
    match: /:(.+?):/g
});

/**
 * Tests:
 * - Link to Kappa
 * - Parse to Markdown
 *  - Global Twitch emote (CoolCat)
 *  - User Twitch emote (tppD)
 *  - Global BTTV emote (SourPls)
 *  - Channel BTTV emote (tppUrn)
 *  - Shared BTTV emote (MODS)
 *  - FFZ emote from user name (AWOOO)
 *  - FFZ emote from user ID (SanaeSip)
 */
Promise.all([
    fetcher.fetchTwitchEmotes(),
    fetcher.fetchTwitchEmotes(56648155),
    fetcher.fetchBTTVEmotes(),
    fetcher.fetchBTTVEmotes(56648155),
    fetcher.fetchFFZEmotes('sylux98'),
    fetcher.fetchFFZEmotes(13638332)
]).then(() => {
    const kappa = fetcher.emotes.get('Kappa');
    assert.strictEqual(kappa.toLink(2), 'https://static-cdn.jtvnw.net/emoticons/v1/25/3.0');

    const text = parser.parse(':CoolCat:\n:tppD:\n:SourPls:\n:tppUrn:\n:MODS:\n:AWOOO:\n:SanaeSip:');
    assert.strictEqual(text, [
        '![CoolCat](https://static-cdn.jtvnw.net/emoticons/v1/58127/1.0 "CoolCat")',
        '![tppD](https://static-cdn.jtvnw.net/emoticons/v1/303132934/1.0 "tppD")',
        '![SourPls](https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/1x "SourPls")',
        '![tppUrn](https://cdn.betterttv.net/emote/5f5f7d5f68d9d86c020e8672/1x "tppUrn")',
        '![MODS](https://cdn.betterttv.net/emote/5f2c4f9e65fe924464ef6d61/1x "MODS")',
        '![AWOOO](https://cdn.frankerfacez.com/emote/67/1 "AWOOO")',
        '![SanaeSip](https://cdn.frankerfacez.com/emote/305078/1 "SanaeSip")'
    ].join('\n'));
}).catch(err => {
    console.error('Test failed!');
    console.error(err);
});
