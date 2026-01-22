import { describe, expect, test } from '@jest/globals';
import { EmoteFetcher, EmoteParser, Collection } from '../src/index.js';

describe('Test BTTV emotes', () => {
    describe('Test global emotes', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        test('Execute fetchBTTVEmotes without any parameters', async() => {
            expect(await emoteFetcher.fetchBTTVEmotes()).toBeInstanceOf(Collection);
        });

        test('Get emote (SourPls)', () => {
            const emote = emoteFetcher.emotes.get('SourPls');
            expect(emote.toLink(2)).toBe('https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/3x.webp');
        });

        test('Parse string with emote (SourPls)', () => {
            const text = emoteParser.parse('This is a test string with :SourPls: in it.');
            expect(text).toBe('This is a test string with ![SourPls](https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/1x.webp "SourPls") in it.');
        });
    });

    describe('Test user emotes', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        test('Execute fetchBTTVEmotes with user ID', async() => {
            expect(await emoteFetcher.fetchBTTVEmotes(56648155)).toBeInstanceOf(Collection);
        });

        test('Get emote (tppUrn)', () => {
            const emote = emoteFetcher.emotes.get('tppUrn');
            expect(emote.toLink(2)).toBe('https://cdn.betterttv.net/emote/5f5f7d5f68d9d86c020e8672/3x.webp');
        });

        test('Parse string with emote (tppUrn)', () => {
            const text = emoteParser.parse('This is a test string with :tppUrn: in it.');
            expect(text).toBe('This is a test string with ![tppUrn](https://cdn.betterttv.net/emote/5f5f7d5f68d9d86c020e8672/1x.webp "tppUrn") in it.');
        });
    });

    describe('Test static preference', () => {
        const emoteFetcher = new EmoteFetcher();
        const emoteParser = new EmoteParser(emoteFetcher, {
            type: 'markdown',
            match: /:(.+?):/g
        });

        test('Override forcing static in .toLink()', async() => {
            await emoteFetcher.fetchBTTVEmotes();
            const emote = emoteFetcher.emotes.get('SourPls');
            expect(emote.toLink(2, true)).toBe('https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/3x.png');
        });

        test('Override forcing static in .parse()', () => {
            const text = emoteParser.parse('This is a test string with :SourPls: in it.', null, true);
            expect(text).toBe('This is a test string with ![SourPls](https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/1x.png "SourPls") in it.');
        });
    });
});
