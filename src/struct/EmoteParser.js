const Constants = require('../util/Constants');

class EmoteParser {
    /**
     * A parser to replace text with emotes.
     * @param {EmoteFetcher} fetcher - The fetcher to use the cache of.
     * @param {Object} [options={}] - Options for the parser.
     * @param {string} [options.template] - The template to be used.
     * The strings that can be interpolated are:
     * - `{link}` The link of the emote.
     * - `{name}` The name of the emote.
     * - `{size}` The size of the image.
     * - `{creator}` The channel/owner name of the emote.
     * @param {string} [options.type='markdown'] - The type of the parser.
     * Can be one of `markdown`, `html`, `bbcode`, or `plain`.
     * If the `template` option is provided, this is ignored.
     * @param {RegExp} [options.match=/:(.+?):/g] - The regular expression that matches an emote.
     * Must be a global regex, with one capture group for the emote code.
     */
    constructor(fetcher, options = {}) {
        /**
         * The emote fetcher being used.
         * @type {EmoteFetcher}
         */
        this.fetcher = fetcher;

        /**
         * The parser options.
         * @type {Object}
         */
        this.options = Object.assign({
            template: '<img class="twitch-emote twitch-emote-{size}" title="{name}" src="{link}">',
            type: 'html',
            match: /:(.+?):/g
        }, options);

        this._validateOptions(this.options);
    }

    _validateOptions(options) {
        if (options.template && typeof options.template !== 'string') {
            throw new TypeError('Template must be a string');
        }

        if (!['markdown', 'html', 'bbcode', 'plain'].includes(options.type)) {
            throw new TypeError('Parse type must be one of `markdown`, `html`, `bbcode`, or `plain`');
        }

        if (!(options.match instanceof RegExp) || !options.match.global) {
            throw new TypeError('Match must be a global RegExp.');
        }
    }

    /**
     * Parses text.
     * @param {string} text - Text to parse.
     * @param {number} size - Size for emotes.
     * @returns {string}
     */
    parse(text, size = 0) {
        const parsed = text.replace(this.options.match, (matched, id) => {
            const emote = this.fetcher.emotes.get(id);
            if (!emote) return matched;

            const template = this.options.template || Constants.Templates[this.options.type];
            const link = emote.toLink(size);
            const res = template
                .replace(/{link}/g, link)
                .replace(/{name}/g, emote.code)
                .replace(/{size}/g, size)
                .replace(/{creator}/g, emote.ownerName || 'global');

            return res;
        });

        return parsed;
    }
}

module.exports = EmoteParser;
