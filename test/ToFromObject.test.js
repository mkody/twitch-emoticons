import { describe, expect, test, beforeEach } from '@jest/globals';
import { env } from 'process';
import { EmoteFetcher, EmoteParser } from '../src/index.js';

describe('Test toObject', () => {
    let emoteFetcher;

    beforeEach(() => {
        // Make a fresh EmoteFetcher object before each tests
        // This prevents surprises in case there's an emote name used in multiple sources
        emoteFetcher = new EmoteFetcher(env.TWITCH_ID, env.TWITCH_SECRET);
    });

    test('BTTV Global Emote', async() => {
        await emoteFetcher.fetchBTTVEmotes();
        expect(emoteFetcher.emotes.get('SourPls').toObject()).toMatchSnapshot();
    });

    test('BTTV User Emote', async() => {
        await emoteFetcher.fetchBTTVEmotes(56648155);
        expect(emoteFetcher.emotes.get('tppUrn').toObject()).toMatchSnapshot();
    });

    test('BTTV User Animated Emote', async() => {
        await emoteFetcher.fetchBTTVEmotes(56648155);
        expect(emoteFetcher.emotes.get('MODS').toObject()).toMatchSnapshot();
    });

    test('FFZ Global Emote', async() => {
        await emoteFetcher.fetchFFZEmotes();
        expect(emoteFetcher.emotes.get('CatBag').toObject()).toMatchSnapshot();
    });

    test('FFZ User Emote', async() => {
        await emoteFetcher.fetchFFZEmotes(13638332);
        expect(emoteFetcher.emotes.get('SanaeSip').toObject()).toMatchSnapshot();
    });

    test('FFZ User Animated Emote', async() => {
        await emoteFetcher.fetchFFZEmotes(44317909);
        expect(emoteFetcher.emotes.get('MikuSway').toObject()).toMatchSnapshot();
    });

    test('7TV Global Emote (AVIF)', async() => {
        await emoteFetcher.fetchSevenTVEmotes(null, 'avif');
        expect(emoteFetcher.emotes.get('EZ').toObject()).toMatchSnapshot();
    });

    test('7TV User Emote', async() => {
        await emoteFetcher.fetchSevenTVEmotes(44317909);
        // YABE was picked as it has been renamed from "fubukiYabe" on this channel
        expect(emoteFetcher.emotes.get('YABE').toObject()).toMatchSnapshot();
    });

    if (env.TWITCH_ID === undefined || env.TWITCH_SECRET === undefined
        || env.TWITCH_ID === '' || env.TWITCH_SECRET === '') {
        test.todo('Notice: Twitch client id/secret missing, not testing with Twitch emotes.');
    } else {
        test('Twitch Global Emote', async() => {
            await emoteFetcher.fetchTwitchEmotes();
            // Use inline to not fail when the environment variables are not set
            expect(emoteFetcher.emotes.get('Kappa').toObject()).toMatchInlineSnapshot(`
{
  "animated": false,
  "channel_id": null,
  "code": "Kappa",
  "id": "25",
  "set": undefined,
  "type": "twitch",
}
`);
        });

        test('Twitch User Emote', async() => {
            await emoteFetcher.fetchTwitchEmotes(56648155);
            // Use inline to not fail when the environment variables are not set
            expect(emoteFetcher.emotes.get('tppD').toObject()).toMatchInlineSnapshot(`
{
  "animated": false,
  "channel_id": 56648155,
  "code": "tppD",
  "id": "307609315",
  "set": undefined,
  "type": "twitch",
}
`);
        });
    }
});

describe('Test fromObject', () => {
    const emoteFetcher = new EmoteFetcher();
    const emoteParser = new EmoteParser(emoteFetcher, {
        type: 'markdown',
        match: /(\w+)+?/g
    });

    const emotes_obj = [
        {
            code: 'tppD',
            id: '307609315',
            channel_id: 56648155,
            animated: false,
            set: undefined,
            type: 'twitch'
        },
        {
            code: 'SourPls',
            id: '566ca38765dbbdab32ec0560',
            channel_id: null,
            animated: true,
            ownerName: null,
            type: 'bttv'
        },
        {
            code: 'modCheck',
            id: '60abf171870d317bef23d399',
            channel_id: 44317909,
            animated: true,
            sizes: ['1x.webp', '2x.webp', '3x.webp', '4x.webp'],
            ownerName: 'Laden',
            type: '7tv',
            imageType: 'webp'
        },
        {
            code: 'MikuSway',
            id: 723102,
            channel_id: 44317909,
            animated: true,
            sizes: ['1', '2', '4'],
            ownerName: 'brian6932',
            type: 'ffz',
            modifier: false
        }
    ];

    test('Execute fromObject', () => {
        expect(emoteFetcher.fromObject(emotes_obj)).toBeInstanceOf(Array);
    });

    test('Get emote (SourPls)', () => {
        const emote = emoteFetcher.emotes.get('SourPls');
        expect(emote.toLink()).toBe('https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/1x.webp');
    });

    test('Parse string with emotes (tppD, SourPls, modCheck, MikuSway)', () => {
        expect(emoteParser.parse('tppD SourPls modCheck MikuSway')).toBe(
            [
                '![tppD](https://static-cdn.jtvnw.net/emoticons/v2/307609315/default/dark/1.0 "tppD")',
                '![SourPls](https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/1x.webp "SourPls")',
                '![modCheck](https://cdn.7tv.app/emote/60abf171870d317bef23d399/1x.webp "modCheck")',
                '![MikuSway](https://cdn.frankerfacez.com/emote/723102/animated/1.webp "MikuSway")'
            ].join(' ')
        );
    });
});
