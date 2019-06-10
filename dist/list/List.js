"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const Fulfilled_1 = require("../future/Fulfilled");
const Rejected_1 = require("../future/Rejected");
const Comparison_1 = require("./Comparison");
class List {
    constructor(items) {
        this.items = items;
        this.length = items.length;
    }
    //region Mapping
    map(f) {
        return new List(this.items.map(f));
    }
    parallelMap(f) {
        return new __1.Future(() => new Promise(resolve => {
            const promises = this.items.map(x => new Promise(resolve => resolve(f(x))));
            return Promise.all(promises)
                .then(values => resolve(Fulfilled_1.fulfilled(values)))
                .catch(error => resolve(Rejected_1.rejected(error)));
        }));
    }
    //endregion
    //region Sorting
    sort() {
        return new List(this.items.sort(Comparison_1.compare));
    }
    sortBy(f) {
        return new List(this.items.sort((a, b) => Comparison_1.compareBy(a, b, f)));
    }
    sortDescendingly() {
        return new List(this.items.sort(Comparison_1.negatedCompare));
    }
    sortDescendinglyBy(f) {
        return new List(this.items.sort((a, b) => Comparison_1.negatedCompareBy(a, b, f)));
    }
    //endregion
    //region Size
    size() {
        return this.length;
    }
    isEmpty() {
        return this.items.length === 0;
    }
    isNotEmpty() {
        return this.items.length > 0;
    }
    //endregion
    //region Item tests
    all(predicate) {
        for (let index = 0; index < this.items.length; index++) {
            if (!predicate(this.items[index])) {
                return false;
            }
        }
        return true;
    }
    some(predicate) {
        for (let index = 0; index < this.items.length; index++) {
            if (predicate(this.items[index])) {
                return true;
            }
        }
        return false;
    }
    none(predicate) {
        return !this.some(predicate);
    }
    count(predicate) {
        let count = 0;
        for (let index = 0; index < this.items.length; index++) {
            if (predicate(this.items[index])) {
                count += 1;
            }
        }
        return count;
    }
    //endregion
    //region Equality test
    equals(otherList) {
        if (otherList == null) {
            return false;
        }
        const otherArray = otherList.toArray();
        if (this.items.length !== otherArray.length) {
            return false;
        }
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] !== otherArray[i]) {
                return false;
            }
        }
        return true;
    }
    //endregion
    //region Access
    get(index) {
        return __1.option(this.items[index]);
    }
    getOrElse(index, alternative) {
        if (this.items.length > index) {
            return this.items[index];
        }
        else {
            return alternative instanceof Function ? alternative() : alternative;
        }
    }
    take(n) {
        if (n > 0) {
            return new List(this.items.slice(0, n));
        }
        else {
            const length = this.items.length;
            const res = this.items.slice(length + n, length);
            return new List(res);
        }
    }
    filter(predicate) {
        return new List(this.items.filter(predicate));
    }
    //endregion
    //region Concatenation
    concat(otherList) {
        const thisArray = this.items;
        const otherArray = otherList.toArray();
        const thisLength = thisArray.length;
        const otherLength = otherArray.length;
        const concatenation = Array(thisLength + otherLength);
        for (let i = 0; i < thisLength; i++) {
            concatenation[i] = thisArray[i];
        }
        for (let j = 0; j < otherLength; j++) {
            concatenation[thisLength + j] = otherArray[j];
        }
        return new List(concatenation);
    }
    //endregion
    //region Side-effects
    perform(sideEffect) {
        sideEffect(this);
    }
    performOnEmpty(sideEffect) {
        if (this.items.length > 0) {
            return;
        }
        sideEffect(this);
    }
    performOnNonEmpty(sideEffect) {
        if (this.items.length == 0) {
            return;
        }
        sideEffect(this);
    }
    forEach(sideEffects) {
        this.items.forEach(sideEffects);
    }
    //endregion
    //region Conversion
    toArray() {
        return this.items;
    }
    //endregion
    //region Chaining
    flatten() {
        let size = 0;
        const listOfArrays = this;
        for (let i = 0; i < listOfArrays.items.length; i++) {
            size += listOfArrays.items[i].length;
        }
        const flattened = new Array(size);
        let flattenedIndex = 0;
        for (let listIndex = 0; listIndex < this.items.length; listIndex++) {
            this.items[listIndex].forEach(item => {
                flattened[flattenedIndex++] = item;
            });
        }
        return new List(flattened);
    }
    chain(f) {
        return this.map(f).flatten();
    }
}
exports.List = List;
function list(...array) {
    return new List(array);
}
exports.list = list;
function emptyList() {
    return new List([]);
}
exports.emptyList = emptyList;
function range(start, end) {
    if (!end) {
        end = start;
        start = 0;
    }
    const array = new Array(end - start);
    for (let index = 0, value = start; index < end - start; index++, value++) {
        array[index] = value;
    }
    return new List(array);
}
exports.range = range;
//# sourceMappingURL=List.js.map