module.exports = {
    Twitch: {
        CDN: (id, size) => `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/${size + 1}.0`
    },
    BTTV: {
        Global: 'https://api.betterttv.net/3/cached/emotes/global',
        Channel: id => `https://api.betterttv.net/3/cached/users/twitch/${id}`,
        CDN: (id, size) => `https://cdn.betterttv.net/emote/${id}/${size + 1}x`
    },
    SEVENTV: {
        Global: 'https://7tv.io/v3/emote-sets/global',
        Channel: id => `https://7tv.io/v3/users/twitch/${id}`,
        CDN: (id, size) => `https://cdn.7tv.app/emote/${id}/${size}`
    },
    FFZ: {
        Channel: id => `https://api.frankerfacez.com/v1/room/id/${id}`,
        CDN: (id, size) => `https://cdn.frankerfacez.com/emote/${id}/${size}`
    },
    Templates: {
        html: '<img alt="{name}" title="{name}" class="twitch-emote twitch-emote-{size}" src="{link}">',
        markdown: '![{name}]({link} "{name}")',
        bbcode: '[img]{link}[/img]',
        plain: '{link}'
    }
};
