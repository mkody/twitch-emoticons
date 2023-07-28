/* eslint-disable no-console */

const assert = require('assert');
const { env } = require('process');
const { EmoteFetcher, EmoteParser } = require('../src/index.js');

let returnCode = 0;

/**
 * Test Twitch fetching and parsing if environment variables are set.
 *
 * Tests:
 * - Fetch emotes
 *  - Twitch Global
 *  - Twitch Channel (twitchplayspokemon)
 * - Link to Kappa
 * - Parse to Markdown
 *  - Twitch Global emote (CoolCat)
 *  - Twitch Channel emote (tppD)
 */
async function testTwitch() {
    if (env.TWITCH_ID === undefined || env.TWITCH_SECRET === undefined
        || env.TWITCH_ID === '' || env.TWITCH_SECRET === '') {
        console.log('Notice: Twitch client id/secret missing.');
        return;
    }

    const emoteFetcher = new EmoteFetcher(env.TWITCH_ID, env.TWITCH_SECRET);
    const emoteParser = new EmoteParser(emoteFetcher, {
        type: 'markdown',
        match: /:(.+?):/g
    });

    try {
        await Promise.all([
            emoteFetcher.fetchTwitchEmotes(),
            emoteFetcher.fetchTwitchEmotes(56648155)
        ]);

        const kappaEmote = emoteFetcher.emotes.get('Kappa');
        assert.strictEqual(
            kappaEmote.toLink(2),
            'https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0'
        );

        const text = emoteParser.parse(':CoolCat:\n:tppD:');
        assert.strictEqual(
            text,
            [
                '![CoolCat](https://static-cdn.jtvnw.net/emoticons/v2/58127/default/dark/1.0 "CoolCat")',
                '![tppD](https://static-cdn.jtvnw.net/emoticons/v2/307609315/default/dark/1.0 "tppD")'
            ].join('\n')
        );

        console.log('Twitch emotes test was successful.');
    } catch (err) {
        console.error('Twitch emotes test failed!');
        console.error(err);
        returnCode = 1;
    }
}

/*
* Test for a throw if we try to fetch Twitch emotes without a Client ID and Secret
*/
function testTwitchFaulty() {
    const emoteFetcher = new EmoteFetcher();

    try {
        assert.throws(
            () => {
                emoteFetcher.fetchTwitchEmotes();
            },
            new Error('Client id or client secret not provided.')
        );
        console.log('Twitch emotes test (without API keys) was successful.');
    } catch (err) {
        console.error('Twitch emotes test (without API keys) failed!');
        console.error(err);
        returnCode = 1;
    }
}

/**
 * Test BetterTTV fetching and parsing.
 *
 * Tests:
 * - Fetch emotes
 *  - BTTV Global
 *  - BTTV Channel (twitchplayspokemon)
 * - Parse to Markdown
 *  - BTTV Global emote (SourPls)
 *  - BTTV Channel emote (tppUrn)
 *  - BTTV Shared emote (MODS)
 */
async function testBTTV() {
    const emoteFetcher = new EmoteFetcher();
    const emoteParser = new EmoteParser(emoteFetcher, {
        type: 'markdown',
        match: /:(.+?):/g
    });

    try {
        await Promise.all([
            emoteFetcher.fetchBTTVEmotes(),
            emoteFetcher.fetchBTTVEmotes(56648155)
        ]);

        const text = emoteParser.parse(':SourPls:\n:tppUrn:\n:MODS:');
        assert.strictEqual(
            text,
            [
                '![SourPls](https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/1x.webp "SourPls")',
                '![tppUrn](https://cdn.betterttv.net/emote/5f5f7d5f68d9d86c020e8672/1x.webp "tppUrn")',
                '![MODS](https://cdn.betterttv.net/emote/5f2c4f9e65fe924464ef6d61/1x.webp "MODS")'
            ].join('\n')
        );

        console.log('BTTV emotes test was successful.');
    } catch (err) {
        console.error('BTTV emotes test failed!');
        console.error(err);
        returnCode = 1;
    }
}

/**
 * Test FrankerFaceZ fetching and parsing.
 *
 * Tests:
 * - Fetch emotes
 *  - FFZ Global
 *  - FFZ Channel (0kody)
 *  - FFZ Channel (shizuka_natsume)
 * - Parse to Markdown
 *  - FFZ Global emote (CatBag)
 *  - FFZ Channel emote (5Head)
 *  - FFZ Channel animated emote (MikuSway)
 *  - FFZ Channel emote (SanaeSip)
 *  - FFZ modifier (ffzHyper)
 */
async function testFFZ() {
    const emoteFetcher = new EmoteFetcher();
    const emoteParser = new EmoteParser(emoteFetcher, {
        type: 'markdown',
        match: /:(.+?):/g
    });

    try {
        await Promise.all([
            emoteFetcher.fetchFFZEmotes(),
            emoteFetcher.fetchFFZEmotes(44317909),
            emoteFetcher.fetchFFZEmotes(13638332)
        ]);

        const text = emoteParser.parse(':CatBag:\n:5Head:\n:MikuSway:\n:SanaeSip: :ffzHyper:');
        assert.strictEqual(
            text,
            [
                '![CatBag](https://cdn.frankerfacez.com/emote/25927/1 "CatBag")',
                '![5Head](https://cdn.frankerfacez.com/emote/239504/1 "5Head")',
                '![MikuSway](https://cdn.frankerfacez.com/emote/723102/animated/1.webp "MikuSway")',
                // Note the trailing space as ffZHyper is removed but not the space before
                '![SanaeSip](https://cdn.frankerfacez.com/emote/305078/1 "SanaeSip") '
            ].join('\n')
        );

        console.log('FFZ emotes test was successful.');
    } catch (err) {
        console.error('FFZ emotes test failed!');
        console.error(err);
        returnCode = 1;
    }
}

/**
 * Test 7TV fetching and parsing.
 *
 * Tests:
 * - Fetch emotes
 *  - 7TV Global (in AVIF format)
 *  - 7TV Channel (0kody)
 * - Parse to Markdown
 *  - 7TV Global emote (EZ)
 *  - 7TV Global emote (Clap)
 *  - 7TV Channel emote (modCheck)
 */
async function testSevenTV() {
    const emoteFetcher = new EmoteFetcher();
    const emoteParser = new EmoteParser(emoteFetcher, {
        type: 'markdown',
        match: /:(.+?):/g
    });

    try {
        await Promise.all([
            emoteFetcher.fetchSevenTVEmotes(null, 'avif'),
            emoteFetcher.fetchSevenTVEmotes(44317909)
        ]);

        const text = emoteParser.parse(':EZ:\n:Clap:\n:modCheck:');
        assert.strictEqual(
            text, [
                '![EZ](https://cdn.7tv.app/emote/63071b80942ffb69e13d700f/1x.avif "EZ")',
                '![Clap](https://cdn.7tv.app/emote/62fc0a0c4a75fd54bd3520a9/1x.avif "Clap")',
                '![modCheck](https://cdn.7tv.app/emote/60abf171870d317bef23d399/1x.webp "modCheck")'
            ].join('\n')
        );

        console.log('7TV emotes test was successful.');
    } catch (err) {
        console.error('7TV emotes test failed!');
        console.error('(Note that emotes might have been updated.)');
        console.error(err);
        returnCode = 1;
    }
}

/**
 * Test toObject functionality.
 *
 * Tests:
 * - Converting select emotes from each type to Object
 */
async function testToObject() {
    const emoteFetcher = new EmoteFetcher(env.TWITCH_ID, env.TWITCH_SECRET);

    const emoteFetch = [
        emoteFetcher.fetchBTTVEmotes(),
        emoteFetcher.fetchBTTVEmotes(56648155),
        emoteFetcher.fetchFFZEmotes(),
        emoteFetcher.fetchFFZEmotes(44317909),
        emoteFetcher.fetchFFZEmotes(13638332),
        emoteFetcher.fetchSevenTVEmotes(null, 'avif'),
        emoteFetcher.fetchSevenTVEmotes(44317909)
    ];

    if (env.TWITCH_ID && env.TWITCH_SECRET) {
        emoteFetch.push(
            emoteFetcher.fetchTwitchEmotes(),
            emoteFetcher.fetchTwitchEmotes(56648155)
        );
    }

    try {
        await Promise.all(emoteFetch);

        assert.deepStrictEqual(emoteFetcher.emotes.get('SourPls').toObject(), {
            id: '566ca38765dbbdab32ec0560',
            type: 'bttv',
            code: 'SourPls',
            ownerName: null,
            animated: true,
            channel_id: null
        });

        assert.deepStrictEqual(emoteFetcher.emotes.get('tppUrn').toObject(), {
            id: '5f5f7d5f68d9d86c020e8672',
            type: 'bttv',
            code: 'tppUrn',
            ownerName: null,
            animated: false,
            channel_id: 56648155
        });

        assert.deepStrictEqual(emoteFetcher.emotes.get('MODS').toObject(), {
            id: '5f2c4f9e65fe924464ef6d61',
            type: 'bttv',
            code: 'MODS',
            ownerName: 'bearrrr_',
            animated: true,
            channel_id: 56648155
        });

        assert.deepStrictEqual(emoteFetcher.emotes.get('CatBag').toObject(), {
            id: 25927,
            type: 'ffz',
            code: 'CatBag',
            ownerName: 'wolsk',
            animated: false,
            modifier: false,
            channel_id: undefined,
            sizes: ['1', '2', '4']
        });

        assert.deepStrictEqual(emoteFetcher.emotes.get('5Head').toObject(), {
            id: 239504,
            type: 'ffz',
            code: '5Head',
            ownerName: 'sublimedtv',
            animated: false,
            modifier: false,
            channel_id: 44317909,
            sizes: ['1', '2', '4']
        });

        assert.deepStrictEqual(emoteFetcher.emotes.get('MikuSway').toObject(), {
            id: 723102,
            type: 'ffz',
            code: 'MikuSway',
            ownerName: 'brian6932',
            animated: true,
            modifier: false,
            channel_id: 44317909,
            sizes: ['1', '2', '4']
        });

        assert.deepStrictEqual(emoteFetcher.emotes.get('SanaeSip').toObject(), {
            id: 305078,
            type: 'ffz',
            code: 'SanaeSip',
            ownerName: 'shizuka_natsume',
            animated: false,
            modifier: false,
            channel_id: 13638332,
            sizes: ['1', '2', '4']
        });

        assert.deepStrictEqual(emoteFetcher.emotes.get('EZ').toObject(), {
            id: '63071b80942ffb69e13d700f',
            type: '7tv',
            code: 'EZ',
            ownerName: 'Kh4N_02',
            animated: false,
            channel_id: null,
            sizes: ['1x.avif', '2x.avif', '3x.avif', '4x.avif'],
            imageType: 'avif'
        });

        assert.deepStrictEqual(emoteFetcher.emotes.get('Clap').toObject(), {
            id: '62fc0a0c4a75fd54bd3520a9',
            type: '7tv',
            code: 'Clap',
            ownerName: 'sunkhaskasis',
            animated: true,
            channel_id: null,
            sizes: ['1x.avif', '2x.avif', '3x.avif', '4x.avif'],
            imageType: 'avif'
        });

        assert.deepStrictEqual(emoteFetcher.emotes.get('modCheck').toObject(), {
            id: '60abf171870d317bef23d399',
            type: '7tv',
            code: 'modCheck',
            ownerName: 'Laden',
            animated: true,
            channel_id: 44317909,
            sizes: ['1x.webp', '2x.webp', '3x.webp', '4x.webp'],
            imageType: 'webp'
        });

        if (env.TWITCH_ID && env.TWITCH_SECRET) {
            assert.deepStrictEqual(emoteFetcher.emotes.get('Kappa').toObject(), {
                id: '25',
                type: 'twitch',
                code: 'Kappa',
                animated: false,
                channel_id: null,
                set: undefined
            });

            assert.deepStrictEqual(emoteFetcher.emotes.get('CoolCat').toObject(), {
                id: '58127',
                type: 'twitch',
                code: 'CoolCat',
                animated: false,
                channel_id: null,
                set: undefined
            });

            assert.deepStrictEqual(emoteFetcher.emotes.get('tppD').toObject(), {
                id: '307609315',
                type: 'twitch',
                code: 'tppD',
                animated: false,
                channel_id: 56648155,
                set: undefined
            });
        }

        console.log('toObject test was successful.');
    } catch (err) {
        console.error('toObject test failed!');
        console.error('(Note that emotes might have been updated.)');
        console.error(err);
        returnCode = 1;
    }
}


/**
 * Test fromOobject functionality.
 *
 * Tests:
 * - Converting select emotes from each type from Object
 * - Testing parser output
 */
function testFromObject() {
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

    try {
        emoteFetcher.fromObject(emotes_obj);

        const text = emoteParser.parse('tppD SourPls modCheck MikuSway');
        assert.strictEqual(
            text,
            [
                '![tppD](https://static-cdn.jtvnw.net/emoticons/v2/307609315/default/dark/1.0 "tppD")',
                '![SourPls](https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/1x.webp "SourPls")',
                '![modCheck](https://cdn.7tv.app/emote/60abf171870d317bef23d399/1x.webp "modCheck")',
                '![MikuSway](https://cdn.frankerfacez.com/emote/723102/animated/1.webp "MikuSway")'
            ].join(' ')
        );

        console.log('fromObject test was successful.');
    } catch (err) {
        console.error('fromObject test failed!');
        console.error(err);
        returnCode = 1;
    }
}

/**
* Execute our tests and exit with our final code.
*/
Promise.all([
    testTwitch(),
    testTwitchFaulty(),
    testBTTV(),
    testFFZ(),
    testSevenTV(),
    testToObject(),
    testFromObject()
]).then(() => {
    process.exit(returnCode);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
