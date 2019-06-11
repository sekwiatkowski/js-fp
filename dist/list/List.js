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
    //region Access
    first(predicate) {
        if (predicate == null) {
            return this.get(0);
        }
        else {
            for (let i = 0; i < this.length; i++) {
                const item = this.items[i];
                if (predicate(item)) {
                    return __1.some(item);
                }
            }
            return __1.none;
        }
    }
    get(index) {
        return __1.option(this.items[index]);
    }
    getArray() {
        return this.items;
    }
    getOrElse(index, alternative) {
        if (this.length > index) {
            return this.items[index];
        }
        else {
            return alternative instanceof Function ? alternative() : alternative;
        }
    }
    last(predicate) {
        const lastIndex = this.length - 1;
        if (predicate == null) {
            return this.get(lastIndex);
        }
        else {
            for (let i = lastIndex; i >= 0; i--) {
                const item = this.items[i];
                if (predicate(item)) {
                    return __1.some(item);
                }
            }
            return __1.none;
        }
    }
    take(n) {
        if (n > 0) {
            return new List(this.items.slice(0, n));
        }
        else {
            const length = this.length;
            const res = this.items.slice(length + n, length);
            return new List(res);
        }
    }
    //endregion
    //region Chaining
    flatten() {
        let size = 0;
        const listOfArrays = this;
        for (let i = 0; i < listOfArrays.length; i++) {
            size += listOfArrays.items[i].length;
        }
        const flattened = new Array(size);
        let flattenedIndex = 0;
        for (let listIndex = 0; listIndex < this.length; listIndex++) {
            this.items[listIndex].forEach(item => {
                flattened[flattenedIndex++] = item;
            });
        }
        return new List(flattened);
    }
    chain(f) {
        return this.map(f).flatten();
    }
    //endregion
    //region Concatenation
    concat(otherList) {
        const thisArray = this.items;
        const otherArray = otherList.getArray();
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
    //region Expansion
    append(item) {
        return new List([...this.items, item]);
    }
    prepend(item) {
        return new List([item, ...this.items]);
    }
    //endregion
    //region Filtering
    filter(predicate) {
        return new List(this.items.filter(predicate));
    }
    //endregion
    //region Grouping
    groupBy(computeKey) {
        let dictionary = {};
        for (let i = 0; i < this.length; i++) {
            const item = this.items[i];
            const key = computeKey(item);
            if (!(key in dictionary)) {
                dictionary[key] = [];
            }
            dictionary[key].push(item);
        }
        return dictionary;
    }
    //endregion
    //region Mapping
    map(f) {
        return new List(this.items.map(f));
    }
    parallelMap(f) {
        return new __1.Future(() => new Promise(resolve => {
            const promises = this.items.map(x => new Promise(resolve => resolve(f(x))));
            return Promise.all(promises)
                .then(items => resolve(Fulfilled_1.fulfilled(items)))
                .catch(error => resolve(Rejected_1.rejected(error)));
        }));
    }
    //endregion
    //region Side-effects
    perform(sideEffect) {
        sideEffect(this);
    }
    performOnEmpty(sideEffect) {
        if (this.length > 0) {
            return;
        }
        sideEffect(this);
    }
    performOnNonEmpty(sideEffect) {
        if (this.length == 0) {
            return;
        }
        sideEffect(this);
    }
    forEach(sideEffects) {
        this.items.forEach(sideEffects);
    }
    //endregion
    //region Status
    size() {
        return this.length;
    }
    isEmpty() {
        return this.length === 0;
    }
    isNotEmpty() {
        return this.length > 0;
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
    //region Testing
    contains(item) {
        for (let i = 0; i < this.length; i++) {
            if (this.items[i] === item) {
                return true;
            }
        }
        return false;
    }
    equals(otherList) {
        if (otherList == null) {
            return false;
        }
        const otherArray = otherList.getArray();
        if (this.length !== otherArray.length) {
            return false;
        }
        for (let i = 0; i < this.length; i++) {
            if (this.items[i] !== otherArray[i]) {
                return false;
            }
        }
        return true;
    }
    all(predicate) {
        for (let index = 0; index < this.length; index++) {
            if (!predicate(this.items[index])) {
                return false;
            }
        }
        return true;
    }
    some(predicate) {
        for (let index = 0; index < this.length; index++) {
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
        for (let index = 0; index < this.length; index++) {
            if (predicate(this.items[index])) {
                count += 1;
            }
        }
        return count;
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
function listFromArray(array) {
    return new List(array);
}
exports.listFromArray = listFromArray;
//# sourceMappingURL=List.js.map