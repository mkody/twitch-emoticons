import { describe, expect, test } from '@jest/globals';
import { EmoteFetcher, EmoteParser, Collection } from '../src/index.js';

describe('Test FFZ emotes', () => {
    describe('Test global emotes', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        test('Execute fetchFFZEmotes without any parameters', async() => {
            expect(await emoteFetcher.fetchFFZEmotes()).toBeInstanceOf(Collection);
        });

        test('Get emote (CatBag)', () => {
            const emote = emoteFetcher.emotes.get('CatBag');
            expect(emote.toLink({ size: 2 })).toBe('https://cdn.frankerfacez.com/emote/25927/4');
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

        test('Execute fetchFFZEmotes with user ID', async() => {
            expect(await emoteFetcher.fetchFFZEmotes(44317909)).toBeInstanceOf(Collection);
        });

        test('Get emote (5Head)', () => {
            const emote = emoteFetcher.emotes.get('5Head');
            expect(emote.toLink({ size: 2 })).toBe('https://cdn.frankerfacez.com/emote/239504/4');
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

        test('Execute fetchFFZEmotes with user ID', async() => {
            expect(await emoteFetcher.fetchFFZEmotes(44317909)).toBeInstanceOf(Collection);
        });

        test('Get animated emote (MikuSway)', () => {
            const emote = emoteFetcher.emotes.get('MikuSway');
            expect(emote.toLink({ size: 2 })).toBe('https://cdn.frankerfacez.com/emote/723102/animated/4.webp');
        });

        test('Parse string with emote (monkaEyes) and modifier (ffzHyper)', () => {
            const text = emoteParser.parse('This is a test string with :monkaEyes: :ffzHyper: in it.');
            // Note the double space: ffzHyper is removed but not the space before
            expect(text).toBe('This is a test string with ![monkaEyes](https://cdn.frankerfacez.com/emote/268204/1 "monkaEyes")  in it.');
        });
    });

    describe('Override static preference', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        test('Forcing static in .toLink()', async() => {
            await emoteFetcher.fetchFFZEmotes(44317909);
            const emote = emoteFetcher.emotes.get('MikuSway');
            expect(emote.toLink({ size: 2, forceStatic: true })).toBe('https://cdn.frankerfacez.com/emote/723102/4');
        });

        test('Forcing static in .parse()', () => {
            const text = emoteParser.parse('This is a test string with :MikuSway: in it.', { forceStatic: true });
            expect(text).toBe('This is a test string with ![MikuSway](https://cdn.frankerfacez.com/emote/723102/1 "MikuSway") in it.');
        });
    });
});
