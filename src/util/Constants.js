module.exports = {
    Twitch: {
        All: 'https://twitchemotes.com/api_cache/v2/images.json',
        CDN: (id, size) => `https://static-cdn.jtvnw.net/emoticons/v1/${id}/${size + 1}.0`
    },
    BTTV: {
        Global: 'https://api.betterttv.net/2/emotes',
        Channel: name => `https://api.betterttv.net/2/channels/${name}`,
        CDN: (id, size) => `https://cdn.betterttv.net/emote/${id}/${size + 1}x`
    },
    FFZ: {
        Channel: name => `https://api.frankerfacez.com/v1/room/${name}`,
        CDN: (id, size) => `https://cdn.frankerfacez.com/emoticon/${id}/${size}`
    },
    Templates: {
        html: '<img class="twitch-emote twitch-emote-{size} src={link}">',
        markdown: '![{name}]({link} "{name}")',
        bbcode: '[img]{link}[/img]',
        plain: '{link}'
    }
};
