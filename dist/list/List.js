"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const Fulfilled_1 = require("../future/Fulfilled");
const Rejected_1 = require("../future/Rejected");
const compare = (a, b) => {
    const aIsNull = a === null;
    const bIsNull = b === null;
    if (aIsNull) {
        if (bIsNull) {
            return 0;
        }
        else if (typeof b === 'undefined') {
            return -1;
        }
        else {
            return 1;
        }
    }
    else if (typeof a === 'undefined') {
        if (bIsNull) {
            return 1;
        }
        else if (typeof b === 'undefined') {
            return 0;
        }
        else {
            return 1;
        }
    }
    // a is neither null nor undefined
    else if (bIsNull || typeof b === 'undefined') {
        return -1;
    }
    else {
        return a < b ? -1 : (a > b ? 1 : 0);
    }
};
const negatedCompare = (a, b) => -compare(a, b);
const compareBy = (a, b, f) => compare(f(a), f(b));
const negatedCompareBy = (a, b, f) => -compareBy(a, b, f);
class List {
    constructor(array) {
        this.array = array;
    }
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
    sort() {
        return new List(this.array.sort(compare));
    }
    sortBy(f) {
        return new List(this.array.sort((a, b) => compareBy(a, b, f)));
    }
    sortDescendingly() {
        return new List(this.array.sort(negatedCompare));
    }
    sortDescendinglyBy(f) {
        return new List(this.array.sort((a, b) => negatedCompareBy(a, b, f)));
    }
    size() {
        return this.array.length;
    }
    isEmpty() {
        return this.array.length === 0;
    }
    isNotEmpty() {
        return this.array.length > 0;
    }
    toArray() {
        return this.array;
    }
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
}
exports.List = List;
function list(...array) {
    return new List(array);
}
exports.list = list;
//# sourceMappingURL=List.js.map