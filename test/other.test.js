import { describe, expect, test } from '@jest/globals';
import { Emote, EmoteFetcher, EmoteParser } from '../src/index.js';

describe('Emote class', () => {
    test('Base Emote class should not be used by itself', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-vars
            const emote = new Emote();
        }).toThrow(
            new Error('Base Emote class cannot be used')
        );
    });
});


describe('Setting a static preference', () => {
    test('Default should be non-static (animated)', () => {
        const emoteFetcher = new EmoteFetcher();
        expect(emoteFetcher.forceStatic).toBe(false);
    });

    test('Static option disabled', () => {
        const emoteFetcher = new EmoteFetcher({
            forceStatic: false
        });
        expect(emoteFetcher.forceStatic).toBe(false);
    });

    test('Static option enabled', () => {
        const emoteFetcher = new EmoteFetcher({
            forceStatic: true
        });
        expect(emoteFetcher.forceStatic).toBe(true);
    });
});

describe('EmoteParser\'s _validateOptions', () => {
    const fetcher = new EmoteFetcher();

    test('Should not throw on valid options', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-vars
            const parser = new EmoteParser(fetcher, {
                template: '![{name}]({link} "{name}")',
                type: 'markdown',
                match: /:(.+?):/g
            });
        }).not.toThrow();
    });

    test('Should throw on invalid template', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-vars
            const parser = new EmoteParser(fetcher, {
                template: () => { return 'test'; }
            });
        }).toThrow(
            new TypeError('Template must be a string')
        );
    });

    test('Should throw on invalid type', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-vars
            const parser = new EmoteParser(fetcher, {
                type: 'invalid-type'
            });
        }).toThrow(
            new TypeError('Parse type must be one of `html`, `markdown`, `bbcode`, or `plain`')
        );
    });

    test('Should throw when not using a global regex', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-vars
            const parser = new EmoteParser(fetcher, {
                match: /:(.+?):/
            });
        }).toThrow(
            new TypeError('Match must be a global RegExp.')
        );
    });

    test('Should throw when not using a regex object', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-vars
            const parser = new EmoteParser(fetcher, {
                match: 'not-a-regex'
            });
        }).toThrow(
            new TypeError('Match must be a global RegExp.')
        );
    });
});
