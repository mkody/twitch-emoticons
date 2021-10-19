/* eslint-disable no-console */

const assert = require('assert');
const { env } = require('process');
const { EmoteFetcher, EmoteParser } = require('../src/index.js');

/**
 * If environement variables are set, test Twitch fetching.
 * If not it has to throws an error.
 *
 * Tests:
 * - Fetch emotes
 *  - Global Twitch
 *  - Channel Twitch (twitchplayspokemon)
 * - Link to Kappa
 * - Parse to Markdown
 *  - Global Twitch emote (CoolCat)
 *  - User Twitch emote (tppD)
 */
if (env.TWITCH_ID !== undefined && env.TWITCH_SECRET !== undefined) {
    const twitchFetcher = new EmoteFetcher(env.TWITCH_ID, env.TWITCH_SECRET);
    const twitchParser = new EmoteParser(twitchFetcher, {
        type: 'markdown',
        match: /:(.+?):/g
    });

    Promise.all([
        twitchFetcher.fetchTwitchEmotes(),
        twitchFetcher.fetchTwitchEmotes(56648155)
    ]).then(() => {
        const kappa = twitchFetcher.emotes.get('Kappa');
        assert.strictEqual(kappa.toLink(2), 'https://static-cdn.jtvnw.net/emoticons/v1/25/3.0');

        const text = twitchParser.parse(':CoolCat:\n:tppD:');
        assert.strictEqual(text, [
            '![CoolCat](https://static-cdn.jtvnw.net/emoticons/v1/58127/1.0 "CoolCat")',
            '![tppD](https://static-cdn.jtvnw.net/emoticons/v1/307609315/1.0 "tppD")'
        ].join('\n'));
    }).then(() => {
        console.log('Twitch emotes test was successful.');
    }).catch(err => {
        console.error('Twitch emotes test failed!');
        console.error(err);
    });
} else {
    console.log('Notice: Twitch client id/secret missing.');
    const twitchFetcher = new EmoteFetcher();

    try {
        assert.throws(() => {
            twitchFetcher.fetchTwitchEmotes();
        }, new Error('Client id or client secret not provided.'));
    } catch (err) {
        console.error('Twitch emotes test failed!');
        console.error(err);
    }
}

/**
 * Tests:
 * - Fetch emotes
 *  - Global BTTV
 *  - Channel BTTV (twitchplayspokemon)
 *  - FFZ user via user name (sylux98)
 *  - FFZ user via user ID (shizuka_natsume)
 *
 * - Parse to Markdown
 *  - Global BTTV emote (SourPls)
 *  - Channel BTTV emote (tppUrn)
 *  - Shared BTTV emote (MODS)
 *  - FFZ emote from user name (AWOOO)
 *  - FFZ emote from user ID (SanaeSip)
 */
const fetcher = new EmoteFetcher();
const parser = new EmoteParser(fetcher, {
    type: 'markdown',
    match: /:(.+?):/g
});

Promise.all([
    fetcher.fetchBTTVEmotes(),
    fetcher.fetchBTTVEmotes(56648155),
    fetcher.fetchFFZEmotes('sylux98'),
    fetcher.fetchFFZEmotes(13638332)
]).then(() => {
    const text = parser.parse(':SourPls:\n:tppUrn:\n:MODS:\n:AWOOO:\n:SanaeSip:');
    assert.strictEqual(text, [
        '![SourPls](https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/1x "SourPls")',
        '![tppUrn](https://cdn.betterttv.net/emote/5f5f7d5f68d9d86c020e8672/1x "tppUrn")',
        '![MODS](https://cdn.betterttv.net/emote/5f2c4f9e65fe924464ef6d61/1x "MODS")',
        '![AWOOO](https://cdn.frankerfacez.com/emote/67/1 "AWOOO")',
        '![SanaeSip](https://cdn.frankerfacez.com/emote/305078/1 "SanaeSip")'
    ].join('\n'));
}).then(() => {
    console.log('BTTV/FFZ emotes test was successful.');
}).catch(err => {
    console.error('BTTV/FFZ emotes test failed!');
    console.error(err);
});
