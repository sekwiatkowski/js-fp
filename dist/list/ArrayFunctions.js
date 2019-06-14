"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const Fulfilled_1 = require("../future/Fulfilled");
const Rejected_1 = require("../future/Rejected");
//region Access
function getItem(items, index) {
    return __1.option(items[index]);
}
exports.getItem = getItem;
function getItemOrElse(items, index, alternative) {
    if (items.length > index) {
        return items[index];
    }
    else {
        return alternative instanceof Function ? alternative() : alternative;
    }
}
exports.getItemOrElse = getItemOrElse;
function takeItems(items, n) {
    if (n > 0) {
        return items.slice(0, n);
    }
    else {
        const length = items.length;
        return items.slice(length + n, length);
    }
}
exports.takeItems = takeItems;
//endregion
//region Chaining
function flatten(items) {
    let size = 0;
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const item = items[itemIndex];
        if (item instanceof Array) {
            size += item.length;
        }
        else {
            size += item.size();
        }
    }
    const flattened = new Array(size);
    let flattenedIndex = 0;
    for (let listIndex = 0; listIndex < items.length; listIndex++) {
        items[listIndex].forEach(item => {
            flattened[flattenedIndex++] = item;
        });
    }
    return flattened;
}
exports.flatten = flatten;
//endregion
//region Expansion
function appendItem(items, item) {
    return [...items, item];
}
exports.appendItem = appendItem;
function prependItem(items, item) {
    return [item, ...items];
}
exports.prependItem = prependItem;
//endregion
//region Filtering
function filterItems(items, predicate) {
    return items.filter(predicate);
}
exports.filterItems = filterItems;
//endregion
//region Reduction
function reduceItemsBy(items, by, operation) {
    let accumulator = by(items[0]);
    for (let i = 1; i < items.length; i++) {
        accumulator = operation(accumulator)(by(items[i]));
    }
    return accumulator;
}
exports.reduceItemsBy = reduceItemsBy;
function foldItemsBy(items, by, operation, initialValue) {
    let accumulator = initialValue;
    for (let i = 0; i < items.length; i++) {
        accumulator = operation(accumulator)(by(items[i]));
    }
    return accumulator;
}
exports.foldItemsBy = foldItemsBy;
//endregion
//region Grouping
function groupItemsBy(items, computeKey) {
    let dictionary = {};
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const key = computeKey(item);
        if (!(key in dictionary)) {
            dictionary[key] = [];
        }
        dictionary[key].push(item);
    }
    return dictionary;
}
exports.groupItemsBy = groupItemsBy;
//endregion
//region Mapping
function mapItems(items, f) {
    return items.map(f);
}
exports.mapItems = mapItems;
function parallelMapItems(items, f) {
    return new __1.Future(() => new Promise(resolve => {
        const promises = items.map(x => new Promise(resolve => resolve(f(x))));
        return Promise.all(promises)
            .then(mappedItems => resolve(Fulfilled_1.fulfilled(mappedItems)))
            .catch(error => resolve(Rejected_1.rejected(error)));
    }));
}
exports.parallelMapItems = parallelMapItems;
//endregion
//region Construction
function rangeOfItems(start, end) {
    if (start == 0 && end == null || start === end) {
        return [];
    }
    function sanitize(start, end) {
        // end is not specified
        if (end == null) {
            return { sanitizedStart: 0, sanitizedEnd: start };
        }
        // end is specified
        else {
            return { sanitizedStart: start, sanitizedEnd: end };
        }
    }
    function configure(start, end) {
        if (start > end) {
            // Ex.: start: 2, end: 0
            //      size: 2, step: -1
            // Ex.: start: -3, end: -6
            //      size: 3, step: -1
            // Ex.: start: 0, end: -1
            //      size: 1, step: -1
            return { size: Math.abs(start - end), step: -1 };
        }
        else {
            // Ex.: start: 0, end: 1
            //      size: 1, step: 1
            // Ex.: start: -3, end: -6
            //      size: 3, step: -1
            return { size: Math.abs(end - start), step: 1 };
        }
    }
    const { sanitizedStart, sanitizedEnd } = sanitize(start, end);
    const { size, step } = configure(sanitizedStart, sanitizedEnd);
    const range = new Array(size);
    for (let index = 0, item = sanitizedStart; index < size; index++, item += step) {
        range[index] = item;
    }
    return range;
}
exports.rangeOfItems = rangeOfItems;
function repeatItems(times, valueOrFunction) {
    const items = new Array(times);
    if (valueOrFunction instanceof Function) {
        for (let index = 0; index < times; index++) {
            items[index] = valueOrFunction(index);
        }
    }
    else {
        for (let index = 0; index < times; index++) {
            items[index] = valueOrFunction;
        }
    }
    return items;
}
exports.repeatItems = repeatItems;
//endregion
//region Search
function findItem(items, predicate) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (predicate(item)) {
            return __1.some(item);
        }
    }
    return __1.none;
}
exports.findItem = findItem;
function findLastItem(items, predicate) {
    for (let index = items.length - 1; index >= 0; index--) {
        const item = items[index];
        if (predicate(item)) {
            return __1.some(item);
        }
    }
    return __1.none;
}
exports.findLastItem = findLastItem;
//endregion
//region Side-effects
function forEachItem(items, sideEffect) {
    items.forEach(sideEffect);
}
exports.forEachItem = forEachItem;
//endregion
//region Sorting
function sortItems(items, compare) {
    return items.sort(compare);
}
exports.sortItems = sortItems;
function sortItemsBy(items, by, compare) {
    return items.sort((a, b) => compare(by(a), by(b)));
}
exports.sortItemsBy = sortItemsBy;
//endregion
//region Testing
function containsItem(items, item) {
    for (let i = 0; i < items.length; i++) {
        if (items[i] === item) {
            return true;
        }
    }
    return false;
}
exports.containsItem = containsItem;
function equalItems(thisArray, thatArray) {
    const thisLength = thisArray.length;
    if (thisLength !== thatArray.length) {
        return false;
    }
    for (let i = 0; i < thisLength; i++) {
        if (thisArray[i] !== thatArray[i]) {
            return false;
        }
    }
    return true;
}
exports.equalItems = equalItems;
function allItems(items, predicate) {
    for (let index = 0; index < items.length; index++) {
        if (!predicate(items[index])) {
            return false;
        }
    }
    return true;
}
exports.allItems = allItems;
function someItem(items, predicate) {
    for (let index = 0; index < items.length; index++) {
        if (predicate(items[index])) {
            return true;
        }
    }
    return false;
}
exports.someItem = someItem;
function noItems(items, predicate) {
    return !someItem(items, predicate);
}
exports.noItems = noItems;
function countItems(items, predicate) {
    let count = 0;
    for (let index = 0; index < items.length; index++) {
        if (predicate(items[index])) {
            count += 1;
        }
    }
    return count;
}
exports.countItems = countItems;
//endregion
//# sourceMappingURL=ArrayFunctions.js.map