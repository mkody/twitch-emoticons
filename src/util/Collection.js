/**
 * An extended Map with utility methods.
 * @class Collection
 */
class Collection extends Map {
    /**
     * Finds first matching value by property or function.
     * Same as `Array#find`.
     * @param {string|Function} propOrFunc - Property or function to test.
     * @param {any} value - Value to find.
     * @returns {any}
     */
    find(propOrFunc, value) {
        if (typeof propOrFunc === 'string') {
            if (typeof value === 'undefined') return null;
            for (const item of this.values()) {
                if (item[propOrFunc] === value) return item;
            }

            return null;
        }

        if (typeof propOrFunc === 'function') {
            let i = 0;
            for (const item of this.values()) {
                if (propOrFunc(item, i, this)) return item;
                i++;
            }

            return null;
        }

        return null;
    }

    /**
     * Filters cache by function.
     * Same as `Array#filter`.
     * @param {Function} func - Function to test.
     * @param {any} [thisArg] - The context for the function.
     * @returns {Collection}
     */
    filter(func, thisArg) {
        if (thisArg) func = func.bind(thisArg);

        const results = new this.constructor();

        let i = 0;
        for (const [key, item] of this) {
            if (func(item, i, this)) results.set(key, item);
            i++;
        }

        return results;
    }

    /**
     * Maps cache by function.
     * Same as `Array#map`.
     * @param {Function} func - Function to use.
     * @param {any} [thisArg] - The context for the function.
     * @returns {any[]}
     */
    map(func, thisArg) {
        if (thisArg) func = func.bind(thisArg);

        const array = new Array(this.size);
        let i = 0;
        for (const item of this.values()) {
            array[i] = func(item, i, this);
            i++;
        }

        return array;
    }
}

module.exports = Collection;
