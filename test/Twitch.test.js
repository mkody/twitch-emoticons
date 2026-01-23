import { describe, expect, test } from '@jest/globals'
import { env } from 'process'
import { EmoteFetcher, EmoteParser, Collection } from '../src/index.js'

describe('Test Twitch emotes', () => {
  test('Test failing when environment variables are not set', () => {
    const emoteFetcher = new EmoteFetcher()

    expect(() => {
      emoteFetcher.fetchTwitchEmotes()
    }).toThrow(
      new Error('Client id or client secret not provided.')
    )
  })

  if (env.TWITCH_ID === undefined || env.TWITCH_SECRET === undefined ||
      env.TWITCH_ID === '' || env.TWITCH_SECRET === '') {
    test.todo('Notice: Twitch client id/secret missing, not testing fetching and parsing.')
  } else {
    describe('Test global emotes', () => {
      const emoteFetcher = new EmoteFetcher({
        twitchAppID: env.TWITCH_ID,
        twitchAppSecret: env.TWITCH_SECRET,
      })
      const emoteParser = new EmoteParser(emoteFetcher, {
        type: 'markdown',
        match: /:(.+?):/g,
      })

      test('Execute fetchTwitchEmotes without any parameters', async () => {
        expect(await emoteFetcher.fetchTwitchEmotes()).toBeInstanceOf(Collection)
      })

      test('Get emote (Kappa)', () => {
        const emote = emoteFetcher.emotes.get('Kappa')
        expect(emote.toLink({ size: 2 })).toBe('https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0')
      })

      test('Parse string with emote (CoolCat)', () => {
        const text = emoteParser.parse('This is a test string with :CoolCat: in it.')
        expect(text).toBe('This is a test string with ![CoolCat](https://static-cdn.jtvnw.net/emoticons/v2/58127/default/dark/1.0 "CoolCat") in it.')
      })
    })

    describe('Test user emotes', () => {
      const emoteFetcher = new EmoteFetcher({
        twitchAppID: env.TWITCH_ID,
        twitchAppSecret: env.TWITCH_SECRET,
      })
      const emoteParser = new EmoteParser(emoteFetcher, {
        type: 'markdown',
        match: /:(.+?):/g,
      })

      test('Execute fetchTwitchEmotes with user ID', async () => {
        expect(await emoteFetcher.fetchTwitchEmotes(56648155)).toBeInstanceOf(Collection)
      })

      test('Get emote (tppD)', () => {
        const emote = emoteFetcher.emotes.get('tppD')
        expect(emote.toLink({ size: 2 })).toBe('https://static-cdn.jtvnw.net/emoticons/v2/307609315/default/dark/3.0')
      })

      test('Parse string with emote (tppD)', () => {
        const text = emoteParser.parse('This is a test string with :tppD: in it.')
        expect(text).toBe('This is a test string with ![tppD](https://static-cdn.jtvnw.net/emoticons/v2/307609315/default/dark/1.0 "tppD") in it.')
      })
    })

    describe('Override static preference', () => {
      const emoteFetcher = new EmoteFetcher({
        twitchAppID: env.TWITCH_ID,
        twitchAppSecret: env.TWITCH_SECRET,
      })
      const emoteParser = new EmoteParser(emoteFetcher, {
        type: 'markdown',
        match: /:(.+?):/g,
      })

      test('Forcing static in .toLink()', async () => {
        await emoteFetcher.fetchTwitchEmotes()
        const emote = emoteFetcher.emotes.get('Kappa')
        expect(emote.toLink({ size: 2, forceStatic: true })).toBe('https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/3.0')
      })

      test('Forcing static in .parse()', () => {
        const text = emoteParser.parse('This is a test string with :CoolCat: in it.', { forceStatic: true })
        expect(text).toBe('This is a test string with ![CoolCat](https://static-cdn.jtvnw.net/emoticons/v2/58127/static/dark/1.0 "CoolCat") in it.')
      })
    })

    describe('Set theme mode preference', () => {
      test('Default theme mode should be dark', () => {
        const emoteFetcher = new EmoteFetcher({
          twitchAppID: env.TWITCH_ID,
          twitchAppSecret: env.TWITCH_SECRET,
        })
        expect(emoteFetcher.twitchThemeMode).toBe('dark')
      })

      test('Light theme mode option', async () => {
        const emoteFetcher = new EmoteFetcher({
          twitchAppID: env.TWITCH_ID,
          twitchAppSecret: env.TWITCH_SECRET,
          twitchThemeMode: 'light',
        })
        expect(emoteFetcher.twitchThemeMode).toBe('light')

        await emoteFetcher.fetchTwitchEmotes()
        const emote = emoteFetcher.emotes.get('Kappa')
        expect(emote.toLink({ size: 2 })).toBe('https://static-cdn.jtvnw.net/emoticons/v2/25/default/light/3.0')
      })

      test('Dark theme mode option explicitly set', async () => {
        const emoteFetcher = new EmoteFetcher({
          twitchAppID: env.TWITCH_ID,
          twitchAppSecret: env.TWITCH_SECRET,
          twitchThemeMode: 'dark',
        })
        expect(emoteFetcher.twitchThemeMode).toBe('dark')

        await emoteFetcher.fetchTwitchEmotes()
        const emote = emoteFetcher.emotes.get('Kappa')
        expect(emote.toLink({ size: 2 })).toBe('https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0')
      })

      test('Override theme mode in .toLink()', async () => {
        const emoteFetcher = new EmoteFetcher({
          twitchAppID: env.TWITCH_ID,
          twitchAppSecret: env.TWITCH_SECRET,
          twitchThemeMode: 'light',
        })
        // Make sure it's light at first
        expect(emoteFetcher.twitchThemeMode).toBe('light')

        await emoteFetcher.fetchTwitchEmotes()
        const emote = emoteFetcher.emotes.get('Kappa')
        // And now override to dark
        expect(emote.toLink({ size: 2, themeMode: 'dark' })).toBe('https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0')
      })

      test('Parse string with light theme mode emote', async () => {
        const emoteFetcher = new EmoteFetcher({
          twitchAppID: env.TWITCH_ID,
          twitchAppSecret: env.TWITCH_SECRET,
          twitchThemeMode: 'light',
        })
        const emoteParser = new EmoteParser(emoteFetcher, {
          type: 'markdown',
          match: /:(.+?):/g,
        })

        await emoteFetcher.fetchTwitchEmotes()
        const text = emoteParser.parse('This is a test string with :CoolCat: in it.')
        expect(text).toBe('This is a test string with ![CoolCat](https://static-cdn.jtvnw.net/emoticons/v2/58127/default/light/1.0 "CoolCat") in it.')
      })

      test('Override theme mode in .parse()', async () => {
        const emoteFetcher = new EmoteFetcher({
          twitchAppID: env.TWITCH_ID,
          twitchAppSecret: env.TWITCH_SECRET,
        })
        const emoteParser = new EmoteParser(emoteFetcher, {
          type: 'markdown',
          match: /:(.+?):/g,
        })

        await emoteFetcher.fetchTwitchEmotes()
        const text = emoteParser.parse('This is a test string with :CoolCat: in it.', { themeMode: 'light' })
        expect(text).toBe('This is a test string with ![CoolCat](https://static-cdn.jtvnw.net/emoticons/v2/58127/default/light/1.0 "CoolCat") in it.')
      })
    })
  }
})
