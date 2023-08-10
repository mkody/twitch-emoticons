const { describe, expect, test } = require('@jest/globals');
const { Emote } = require('../src/index.js');

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
