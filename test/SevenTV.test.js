const { describe, expect, test, beforeAll } = require('@jest/globals');
const { EmoteFetcher, EmoteParser } = require('../src/index.js');

describe('Test 7TV emotes', () => {
    describe('Test global emotes (WEBP)', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        beforeAll(() => {
            return emoteFetcher.fetchSevenTVEmotes(null, 'webp');
        });

        test('Get emote (EZ)', () => {
            const emote = emoteFetcher.emotes.get('EZ');
            expect(emote.toLink(2)).toBe('https://cdn.7tv.app/emote/63071b80942ffb69e13d700f/3x.webp');
        });

        test('Parse string with emote (EZ)', () => {
            const text = emoteParser.parse('This is a test string with :EZ: in it.');
            expect(text).toBe('This is a test string with ![EZ](https://cdn.7tv.app/emote/63071b80942ffb69e13d700f/1x.webp "EZ") in it.');
        });
    });

    describe('Test global emotes (AVIF)', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        beforeAll(() => {
            return emoteFetcher.fetchSevenTVEmotes(null, 'avif');
        });

        test('Get emote (Clap)', () => {
            const emote = emoteFetcher.emotes.get('Clap');
            expect(emote.toLink(2)).toBe('https://cdn.7tv.app/emote/62fc0a0c4a75fd54bd3520a9/3x.avif');
        });

        test('Parse string with emote (Clap)', () => {
            const text = emoteParser.parse('This is a test string with :Clap: in it.');
            expect(text).toBe('This is a test string with ![Clap](https://cdn.7tv.app/emote/62fc0a0c4a75fd54bd3520a9/1x.avif "Clap") in it.');
        });
    });

    describe('Test user emotes', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        beforeAll(() => {
            return emoteFetcher.fetchSevenTVEmotes(44317909);
        });

        test('Get emote (modCheck)', () => {
            const emote = emoteFetcher.emotes.get('modCheck');
            expect(emote.toLink(2)).toBe('https://cdn.7tv.app/emote/60abf171870d317bef23d399/3x.webp');
        });

        test('Parse string with emote (modCheck)', () => {
            const text = emoteParser.parse('This is a test string with :modCheck: in it.');
            expect(text).toBe('This is a test string with ![modCheck](https://cdn.7tv.app/emote/60abf171870d317bef23d399/1x.webp "modCheck") in it.');
        });
    });
});
