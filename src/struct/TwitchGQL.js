/**
 * An interface for Twitch's GraphQL API.
 * @class Collection
 */
class TwitchGQL {
  /**
   * Creates a new Twitch GQL instance.
   * @param {string} [clientId] Client ID to use for queries. Defaults to the ID used in Twitch's frontend.
   */
  constructor (clientId) {
    if (clientId) {
      /**
       * Provided client ID.
       * @type {string}
       */
      this.clientId = clientId
    } else {
      /**
       * Twitch's frontend client ID.
       * @type {string}
       */
      this.clientId = 'kimne78kx3ncx6brgo4mv6wki5h1ko'
    }
  }

  /**
   * Performs a GraphQL query on Twitch's GraphQL API.
   * @param {string} [query] - GraphQL query.
   * @param {object} [variables] - Variables to use in the query.
   * @returns {Promise<object>} - A promise that resolves to the result of the query.
   */
  query (query, variables) {
    if (variables === undefined) {
      variables = {}
    }

    return fetch('https://gql.twitch.tv/gql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-id': this.clientId,
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json())
  }

  /**
   * @returns {Promise<object[]>} - A promise that resolves to an array of global Twitch emotes.
   */
  getGlobalEmotes () {
    return this.query(`
      query GlobalEmotes {
        emoteSet(id: "0") {
          emotes {
            id
            token
            assetType
          }
        }
      }
    `).then((res) => {
      return res.data.emoteSet.emotes.map((emote) => ({
        name: emote.token,
        id: emote.id,
        formats: [emote.assetType.toLowerCase()],
      }))
    })
  }

  /**
   * @param {number} channel - ID of the channel.
   * @returns {Promise<object[]>} - A promise that resolves to an array of global Twitch emotes.
   */
  getChannelEmotes (channel) {
    return this.query(`
      query ChannelEmotes($id: ID!) {
        user(id: $id) {
          subscriptionProducts {
            emotes {
              id
              token
              assetType
            }
          }
        }
      }
    `, { id: channel.toString() }).then((res) => {
      return res.data.user.subscriptionProducts
        .flatMap((tier) => tier.emotes)
        .map((emote) => ({
          name: emote.token,
          id: emote.id,
          formats: [emote.assetType.toLowerCase()],
        }))
    })
  }
}

export default TwitchGQL
