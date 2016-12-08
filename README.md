# twitch-emoticons
Get a Twitch channel's Twitch emotes and BTTV emotes!

### Usage for Twitch emotes
```js
let twitch = require('twitch-emoticons');

// Load some channels we want to use.
// These are specifically for Twitch emotes.
twitch.loadChannel().then(console.log); // Global emotes
twitch.loadChannel('name').then(console.log);
twitch.loadChannels(['nameA', 'nameB', 'nameC']).then(console.log);
twitch.loadByEmote('Kappa').then(console.log);

// If you are not sure which channels to load first, no worries!
// emote() caches the channel and emotes for you if they are not cached.
twitch.emote('Kreygasm').then(console.log);

// Prefixing like BTTV emotes is allowed, but not always the best idea.
twitch.emote(twitch.TWITCH_GLOBAL + ':Kreygasm').then(console.log);
twitch.emote('name:twitchEmote').then(console.log);

// Get a channel by name.
// It also caches the channel and emotes if they are not cached.
twitch.channel('name').then(console.log);
```

### Usage for BTTV emotes
```js
let twitch = require('twitch-emoticons');

// Load the channel we want to use.
// These are specifically for BTTV emotes.
twitch.loadBTTVChannel().then(console.log); // Global BTTV emotes
twitch.loadBTTVChannel('name').then(console.log);

// If you are not sure which channels to load first, no worries!
// emote() caches the channel and emotes for you if they are not cached.
// For BTTV emotes, non-global emotes needs to be prefixed with the channel name if they are not cached.
// Note that, unlike Twitch emotes, BTTV emotes do not have a channel property.
twitch.emote('myCoolEmote').then(console.log);
twitch.emote('name:myCoolEmote').then(console.log);

// Global BTTV emotes are fine, but you can prefix it too, in order to save some time.
twitch.emote('FeelsBadMan').then(console.log);
twitch.emote(twitch.BTTV_GLOBAL + ':FeelsBadMan').then(console.log);

// Get a channel by name.
// It also caches the channel and emotes if they are not cached.
twitch.channel('name').then(console.log);
```