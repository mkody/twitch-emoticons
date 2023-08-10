const { describe, expect, test, beforeAll } = require('@jest/globals');
const { EmoteFetcher, EmoteParser } = require('../src/index.js');

describe('Test FFZ emotes', () => {
    describe('Test global emotes', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        beforeAll(() => {
            return emoteFetcher.fetchFFZEmotes();
        });

        test('Get emote (CatBag)', () => {
            const emote = emoteFetcher.emotes.get('CatBag');
            expect(emote.toLink(2)).toBe('https://cdn.frankerfacez.com/emote/25927/4');
        });

        test('Parse string with emote (CatBag)', () => {
            const text = emoteParser.parse('This is a test string with :CatBag: in it.');
            expect(text).toBe('This is a test string with ![CatBag](https://cdn.frankerfacez.com/emote/25927/1 "CatBag") in it.');
        });
    });

    describe('Test user emotes', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        beforeAll(() => {
            return emoteFetcher.fetchFFZEmotes(44317909);
        });

        test('Get emote (5Head)', () => {
            const emote = emoteFetcher.emotes.get('5Head');
            expect(emote.toLink(2)).toBe('https://cdn.frankerfacez.com/emote/239504/4');
        });

        test('Parse string with emote (5Head)', () => {
            const text = emoteParser.parse('This is a test string with :5Head: in it.');
            expect(text).toBe('This is a test string with ![5Head](https://cdn.frankerfacez.com/emote/239504/1 "5Head") in it.');
        });
    });

    describe('Test animated and modifier emotes', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        beforeAll(() => {
            return emoteFetcher.fetchFFZEmotes(44317909);
        });

        test('Get animated emote (MikuSway)', () => {
            const emote = emoteFetcher.emotes.get('MikuSway');
            expect(emote.toLink(2)).toBe('https://cdn.frankerfacez.com/emote/723102/animated/4.webp');
        });

        test('Parse string with emote (monkaEyes) and modifier (ffzHyper)', () => {
            const text = emoteParser.parse('This is a test string with :monkaEyes: :ffzHyper: in it.');
            // Note the double space: ffzHyper is removed but not the space before
            expect(text).toBe('This is a test string with ![monkaEyes](https://cdn.frankerfacez.com/emote/268204/1 "monkaEyes")  in it.');
        });
    });
});
