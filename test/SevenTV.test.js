const { describe, expect, test } = require('@jest/globals');
const { EmoteFetcher, EmoteParser, Collection } = require('../src/index.js');

describe('Test 7TV emotes', () => {
    describe('Test global emotes (WEBP)', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        test('Execute fetchSevenTVEmotes with the WEBP format', async() => {
            expect(await emoteFetcher.fetchSevenTVEmotes(null, 'webp')).toBeInstanceOf(Collection);
        });

        test('Get emote (EZ)', () => {
            const emote = emoteFetcher.emotes.get('EZ');
            expect(emote.toLink(2)).toBe('https://cdn.7tv.app/emote/01FGMVCKMG00021TQRJX35NAT7/3x.webp');
        });

        test('Parse string with emote (EZ)', () => {
            const text = emoteParser.parse('This is a test string with :EZ: in it.');
            expect(text).toBe('This is a test string with ![EZ](https://cdn.7tv.app/emote/01FGMVCKMG00021TQRJX35NAT7/1x.webp "EZ") in it.');
        });
    });

    describe('Test global emotes (AVIF)', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        test('Execute fetchSevenTVEmotes with the AVIF format', async() => {
            expect(await emoteFetcher.fetchSevenTVEmotes(null, 'avif')).toBeInstanceOf(Collection);
        });

        test('Get emote (Clap)', () => {
            const emote = emoteFetcher.emotes.get('Clap');
            expect(emote.toLink(2)).toBe('https://cdn.7tv.app/emote/01GF9MNXQ8000E85YTZ0P4TWJ7/3x.avif');
        });

        test('Parse string with emote (Clap)', () => {
            const text = emoteParser.parse('This is a test string with :Clap: in it.');
            expect(text).toBe('This is a test string with ![Clap](https://cdn.7tv.app/emote/01GF9MNXQ8000E85YTZ0P4TWJ7/1x.avif "Clap") in it.');
        });
    });

    describe('Test user emotes', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        test('Execute fetchSevenTVEmotes with user ID', async() => {
            expect(await emoteFetcher.fetchSevenTVEmotes(44317909)).toBeInstanceOf(Collection);
        });

        test('Get emote (modCheck)', () => {
            const emote = emoteFetcher.emotes.get('modCheck');
            expect(emote.toLink(2)).toBe('https://cdn.7tv.app/emote/01F6FTE8B80008E39HFFQJ7MWS/3x.webp');
        });

        test('Parse string with emote (modCheck)', () => {
            const text = emoteParser.parse('This is a test string with :modCheck: in it.');
            expect(text).toBe('This is a test string with ![modCheck](https://cdn.7tv.app/emote/01F6FTE8B80008E39HFFQJ7MWS/1x.webp "modCheck") in it.');
        });
    });
});
