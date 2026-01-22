export default {
    Twitch: {
        CDN: (id, size = 0, background = 'dark') => `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/${background}/${size + 1}.0`
    },
    BTTV: {
        Global: 'https://api.betterttv.net/3/cached/emotes/global',
        Channel: id => `https://api.betterttv.net/3/cached/users/twitch/${id}`,
        CDN: (id, size = 0) => `https://cdn.betterttv.net/emote/${id}/${size + 1}x.webp`
    },
    SevenTV: {
        Global: 'https://7tv.io/v3/emote-sets/global',
        Channel: id => `https://7tv.io/v3/users/twitch/${id}`,
        CDN: (id, size = 0) => `https://cdn.7tv.app/emote/${id}/${size}`
    },
    FFZ: {
        sets: {
            Global: 3,
            Modifiers: 1532818
        },
        Set: id => `https://api.frankerfacez.com/v1/set/${id}`,
        Channel: id => `https://api.frankerfacez.com/v1/room/id/${id}`,
        CDN: (id, size = 0) => `https://cdn.frankerfacez.com/emote/${id}/${size}`,
        CDNAnimated: (id, size = 0) => `https://cdn.frankerfacez.com/emote/${id}/animated/${size}.webp`
    },
    Templates: {
        html: '<img alt="{name}" title="{name}" class="twitch-emote twitch-emote-{size}" src="{link}">',
        markdown: '![{name}]({link} "{name}")',
        bbcode: '[img]{link}[/img]',
        plain: '{link}'
    }
};
