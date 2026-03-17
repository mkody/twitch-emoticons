export default {
  Twitch: {
    CDN: (id, size = 0, forceStatic = false, theme = 'dark') => `https://static-cdn.jtvnw.net/emoticons/v2/${id}/${forceStatic ? 'static' : 'default'}/${theme}/${size + 1}.0`,
  },
  BTTV: {
    Global: 'https://api.betterttv.net/3/cached/emotes/global',
    Channel: (id) => `https://api.betterttv.net/3/cached/users/twitch/${id}`,
    CDN: (id, size = 0, forceStatic = false) => `https://cdn.betterttv.net/emote/${id}/${size + 1}x.${forceStatic ? 'png' : 'webp'}`,
  },
  SevenTV: {
    GQL: 'https://7tv.io/v4/gql',
    GlobalQuery: `
      query GetGlobalEmotes {
        emoteSets {
          global {
            emotes {
              items {
                id
                alias
                flags {
                  zeroWidth
                }
                emote {
                  defaultName
                  owner {
                    connections {
                      platform
                      platformDisplayName
                    }
                  }
                  flags {
                    nsfw
                    defaultZeroWidth
                    animated
                  }
                  images {
                    url
                    mime
                    scale
                  }
                }
              }
            }
          }
        }
      }
`,
    ChannelQuery: `
      query GetChannelEmotes($platformId: String!) {
        users {
          userByConnection(platform: TWITCH, platformId: $platformId) {
            style {
              activeEmoteSet {
                emotes {
                  items {
                    id
                    alias
                    flags {
                      zeroWidth
                    }
                    emote {
                      defaultName
                      owner {
                        connections {
                          platform
                          platformDisplayName
                        }
                      }
                      flags {
                        nsfw
                        defaultZeroWidth
                        animated
                      }
                      images {
                        url
                        mime
                        scale
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
    CDN: (id, format, size = 1, forceStatic = false) => `https://cdn.7tv.app/emote/${id}/${size}x${forceStatic ? '_static' : ''}.${format}`,
  },
  FFZ: {
    sets: {
      Global: 3,
      Modifiers: 1532818,
    },
    Set: (id) => `https://api.frankerfacez.com/v1/set/${id}`,
    Channel: (id) => `https://api.frankerfacez.com/v1/room/id/${id}`,
    CDN: (id, size = 1) => `https://cdn.frankerfacez.com/emote/${id}/${size}`,
    CDNAnimated: (id, size = 1) => `https://cdn.frankerfacez.com/emote/${id}/animated/${size}.webp`,
  },
  Templates: {
    html: '<img alt="{name}" title="{name}" class="twitch-emote" src="{link}">',
    markdown: '![{name}]({link} "{name}")',
    bbcode: '[img]{link}[/img]',
    plain: '{link}',
  },
}
