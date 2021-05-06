module.exports = {
    Twitch: {
        Global: 'https://api.twitchemotes.com/api/v4/channels/0',
        GlobalFallback: 'https://s.kdy.ch/global.json',
        Channel: id => `https://api.twitchemotes.com/api/v4/channels/${id}`,
        CDN: (id, size) => `https://static-cdn.jtvnw.net/emoticons/v1/${id}/${size + 1}.0`
    },
    BTTV: {
        Global: 'https://api.betterttv.net/3/cached/emotes/global',
        Channel: id => `https://api.betterttv.net/3/cached/users/twitch/${id}`,
        CDN: (id, size) => `https://cdn.betterttv.net/emote/${id}/${size + 1}x`
    },
    FFZ: {
        Channel: id => `https://api.frankerfacez.com/v1/room/id/${id}`,
        ChannelName: name => `https://api.frankerfacez.com/v1/room/${name}`,
        CDN: (id, size) => `https://cdn.frankerfacez.com/emote/${id}/${size}`
    },
    Templates: {
        html: '<img alt="{name}" title="{name}" class="twitch-emote twitch-emote-{size}" src="{link}">',
        markdown: '![{name}]({link} "{name}")',
        bbcode: '[img]{link}[/img]',
        plain: '{link}'
    }
};
