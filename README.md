# twitch-emoticons
Get a Twitch channel's Twitch emotes and BTTV emotes!
```js
const emoticons = require('twitch-emoticons');

// Example for getting Twitch emotes:
emoticons.emote('Kappa').then(emote => {
    console.log(emote.toLink(0));
    // https://static-cdn.jtvnw.net/emoticons/v1/25/1.0
});

// Example for getting BTTV emotes:
emoticons.emote('thefreaking2:gachiGASM').then(emote => {
    console.log(emote.toLink(1));
    // https://cdn.betterttv.net/emote/55999813f0db38ef6c7c663e/2x
});

// Example for getting channels:
emoticons.channel('cirno_tv').then(channel => {
    console.log(channel.emotes);
    // Map {...}
})

// Example for parsing text:
let parsed = emoticons.parse('Hi Kappa, PogChamp; wow, this is Kreygasm!!!', 'html', 2);
console.log(parsed);
// Hi <img class="twitch-emote twitch-emote-2 src=https://static-cdn.jtvnw.net/emoticons/v1/25/3.0">, <img class="twitch-emote twitch-emote-2 src=https://static-cdn.jtvnw.net/emoticons/v1/88/3.0">; wow, this is <img class="twitch-emote twitch-emote-2 src=https://static-cdn.jtvnw.net/emoticons/v1/41/3.0">!!!
```

# Documentation
### Emotes
*Methods related to getting an emote or the Emote class.*
> Due to how BTTV works, non-global BTTV emotes should be accessed like so:
> `channelName:emoteName`
> Once it has been added to the cache, this will not be necessary.
> twitch-emoticons also provide TWITCH\_GLOBAL and BTTV\_GLOBAL for prefixing:
> `TWITCH_GLOBAL + ':emoteName'`
> This is not necessary at all, but may be useful.
##### emote(emoteName)
`emoteName` The name of the emote.
If the emote is not found in cache, twitch-emoticons will attempt to find it and cache the channel and its emotes (Twitch and BTTV).
Returns a Promise containing the Emote object.

##### getEmote(emoteName)
`emoteName` The name of the emote.
Returns an Emote object, if it is in the cache.

##### <Emote>
`id` The emote id.
`name` Name of the emote.
`channel` Channel this emote belongs to. Will be null for non-global BTTV emotes.
`bttv` Whether or not this emote is a BTTV emote.

##### <Emote>.toLink(size)
`size` Size of the image, 0 to 2.
Returns a link to the emote's image.

### Channels
*Methods related to getting a channel or the Channel class.*
##### channel(channelName)
`channelName` The name of the Twitch channel.
If the channel is not found in cache, twitch-emoticons will attempt to find it and cache it and its emotes (Twitch and BTTV).
Returns a Promise containing the Channel object.

##### getChannel(emoteName)
`channelName` The name of the Twitch channel.
Returns a Channel object, if it is in the cache.

##### <Channel>
`name` The channel name.
`emotes` A Map of emotes this channel has.

### Parsing
*These are methods that parses text.*
##### parse(text, type, size)
`text` Text to parse.
`type` One of *html*, *markdown*, or *bbcode*.
`size` Size of the image, 0 to 2.
Only emotes that are cached will be formatted.
Returns the formatted string.

##### parseAll(text, type, size)
`text` Text to parse.
`type` One of *html*, *markdown*, or *bbcode*.
`size` Size of the image, 0 to 2.
Caution! This method goes through every word and checks the APIs for an emote. It is recommended that you use parse() instead.
Returns a Promise containing the formatted string.

### Caching
*These are methods that interact with the cache, where channels and emotes are stored.*
##### loadChannel(channelName)
`channelName` The name of the Twitch channel. Leave null for global Twitch emotes.
Caches a Twitch channel's emotes. This only includes Twitch emotes.
Returns a Promise containing the Channel object.

##### loadChannels(channelNames)
`channelNames` Array of Twitch channel names.
Caches multiple Twitch channels' emotes. This only includes Twitch emotes.
Returns a Promise containing an array of Channel objects.

##### loadBTTVChannel(channelName)
`channelName` The name of the Twitch channel. Leave null for global BTTV emotes.
Caches a Twitch channel's emotes. This only includes BTTV emotes.
Returns a Promise containing the Channel object.

##### clearCache()
Clears the cache completely.