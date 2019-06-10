"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("./List");
function range(start, end) {
    if (!end) {
        end = start;
        start = 0;
    }
    const array = new Array(end - start);
    for (let index = 0, item = start; index < end - start; index++, item++) {
        array[index] = item;
    }
    return new List_1.List(array);
}
exports.range = range;
function rangeInclusive(start, end) {
    if (!end) {
        end = start;
        start = 0;
    }
    return this.range(start, end + 1);
}
exports.rangeInclusive = rangeInclusive;
//# sourceMappingURL=Range.js.map