"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const Fulfilled_1 = require("../future/Fulfilled");
const Rejected_1 = require("../future/Rejected");
const Comparison_1 = require("./Comparison");
class List {
    constructor(array) {
        this.array = array;
    }
    //region Map items
    map(f) {
        return new List(this.array.map(f));
    }
    parallelMap(f) {
        return new __1.Future(() => new Promise(resolve => {
            const promises = this.array.map(x => new Promise(resolve => resolve(f(x))));
            return Promise.all(promises)
                .then(values => resolve(Fulfilled_1.fulfilled(values)))
                .catch(error => resolve(Rejected_1.rejected(error)));
        }));
    }
    //endregion
    //region Sort items
    sort() {
        return new List(this.array.sort(Comparison_1.compare));
    }
    sortBy(f) {
        return new List(this.array.sort((a, b) => Comparison_1.compareBy(a, b, f)));
    }
    sortDescendingly() {
        return new List(this.array.sort(Comparison_1.negatedCompare));
    }
    sortDescendinglyBy(f) {
        return new List(this.array.sort((a, b) => Comparison_1.negatedCompareBy(a, b, f)));
    }
    //endregion
    //region Size
    size() {
        return this.array.length;
    }
    isEmpty() {
        return this.array.length === 0;
    }
    isNotEmpty() {
        return this.array.length > 0;
    }
    //endregion
    //region Test items
    all(predicate) {
        for (let index = 0; index < this.array.length; index++) {
            if (!predicate(this.array[index])) {
                return false;
            }
        }
        return true;
    }
    some(predicate) {
        for (let index = 0; index < this.array.length; index++) {
            if (predicate(this.array[index])) {
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
        for (let index = 0; index < this.array.length; index++) {
            if (predicate(this.array[index])) {
                count += 1;
            }
        }
        return count;
    }
    //endregion
    //region tests equality
    equals(otherList) {
        if (otherList == null) {
            return false;
        }
        const otherArray = otherList.toArray();
        if (this.array.length !== otherArray.length) {
            return false;
        }
        for (let i = 0; i < this.array.length; i++) {
            if (this.array[i] !== otherArray[i]) {
                return false;
            }
        }
        return true;
    }
    //endregion
    //region Get item(s)
    get(index) {
        return __1.option(this.array[index]);
    }
    getOrElse(index, alternative) {
        if (this.array.length > index) {
            return this.array[index];
        }
        else {
            return alternative instanceof Function ? alternative() : alternative;
        }
    }
    take(n) {
        if (n > 0) {
            return new List(this.array.slice(0, n));
        }
        else {
            const length = this.array.length;
            const res = this.array.slice(length + n, length);
            return new List(res);
        }
    }
    filter(predicate) {
        return new List(this.array.filter(predicate));
    }
    //endregion
    //region Concatenate lists
    concat(otherList) {
        const thisArray = this.array;
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
        if (this.array.length > 0) {
            return;
        }
        sideEffect(this);
    }
    performOnNonEmpty(sideEffect) {
        if (this.array.length == 0) {
            return;
        }
        sideEffect(this);
    }
    forEach(sideEffects) {
        this.array.forEach(sideEffects);
    }
    //endregion
    //region Convert list
    toArray() {
        return this.array;
    }
}
exports.List = List;
function list(...array) {
    return new List(array);
}
exports.list = list;
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