import { describe, expect, test } from '@jest/globals';
import { EmoteFetcher, EmoteParser, Collection } from '../src/index.js';

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
            expect(emote.toLink(2)).toBe('https://cdn.7tv.app/emote/01GB4CK01800090V9B3D8CGEEX/3x.webp');
        });

        test('Parse string with emote (EZ)', () => {
            const text = emoteParser.parse('This is a test string with :EZ: in it.');
            expect(text).toBe('This is a test string with ![EZ](https://cdn.7tv.app/emote/01GB4CK01800090V9B3D8CGEEX/1x.webp "EZ") in it.');
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
            expect(emote.toLink(2)).toBe('https://cdn.7tv.app/emote/01GAM8EFQ00004MXFXAJYKA859/3x.avif');
        });

        test('Parse string with emote (Clap)', () => {
            const text = emoteParser.parse('This is a test string with :Clap: in it.');
            expect(text).toBe('This is a test string with ![Clap](https://cdn.7tv.app/emote/01GAM8EFQ00004MXFXAJYKA859/1x.avif "Clap") in it.');
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

        // YABE was picked as it has been renamed from "fubukiYabe" on this channel
        test('Get emote (YABE)', () => {
            const emote = emoteFetcher.emotes.get('YABE');
            expect(emote.toLink(2)).toBe('https://cdn.7tv.app/emote/01FFNN7CG00009CAK0J14696HH/3x.webp');
        });

        test('Parse string with emote (YABE)', () => {
            const text = emoteParser.parse('This is a test string with :YABE: in it.');
            expect(text).toBe('This is a test string with ![YABE](https://cdn.7tv.app/emote/01FFNN7CG00009CAK0J14696HH/1x.webp "YABE") in it.');
        });
    });
});
