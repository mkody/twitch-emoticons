### Usage:
```js
let twitchEmoticons = require('twitch-emoticons');

// These are all Promises!
// Load all emotes in a channel.
twitchEmoticons.loadChannel('channelName'); // use 'null' to load global Twitch emotes.

// Load multiple channels.
twitchEmoticons.loadChannels(['channelA', 'channelB', 'channelC']);

// Getting an emote.
// If you are sure it is cached:
console.log(twitchEmoticons.emotes.get('emoteName').toLink());

// If not:
twitchEmoticons.emote('emoteName').then(emote => console.log(emote).toLink());

// Similarly, with channels.
// If you are sure it is cached:
console.log(twitchEmoticons.channels.get('channelName').name);

// If not:
twitchEmoticons.channel('channelName').then(channel => console.log(channel.name));
```