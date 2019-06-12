"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const Monoids_1 = require("../monoids/Monoids");
const ArrayFunctions_1 = require("./ArrayFunctions");
class NonEmptyList {
    constructor(items) {
        this.items = items;
        this.length = items.length;
    }
    //region Access
    first() {
        return this.items[0];
    }
    get(index) {
        return ArrayFunctions_1.getItem(this.items, index);
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
    last() {
        return this.items[this.length - 1];
    }
    take(n) {
        return new NonEmptyList(ArrayFunctions_1.takeItems(this.items, n));
    }
    //endregion
    //region Chaining
    flatten() {
        return new NonEmptyList(ArrayFunctions_1.flatten(this.items));
    }
    chain(f) {
        return this.map(f).flatten();
    }
    //endregion
    //region Combination
    concat(otherList) {
        return new NonEmptyList(Monoids_1.ArrayConcatenation.combine(this.items)(otherList.items));
    }
    //endregion
    //region Expansion
    append(item) {
        return new NonEmptyList(ArrayFunctions_1.appendItem(this.items, item));
    }
    prepend(item) {
        return new NonEmptyList(ArrayFunctions_1.prependItem(this.items, item));
    }
    //endregion
    //region Filtering
    filter(predicate) {
        return new __1.List(ArrayFunctions_1.filterItems(this.items, predicate));
    }
    //endregion
    //region Folding
    foldBy(by, operation, initialValue) {
        return ArrayFunctions_1.foldItemsBy(this.items, by, operation, initialValue);
    }
    fold(operation, initialValue) {
        return this.foldBy(x => x, operation, initialValue);
    }
    foldWithMonoid(monoid) {
        return this.fold(monoid.combine, monoid.identityElement);
    }
    foldByWithMonoid(by, monoid) {
        return this.foldBy(by, monoid.combine, monoid.identityElement);
    }
    max() {
        return this.foldWithMonoid(Monoids_1.Max);
    }
    maxBy(by) {
        return this.foldByWithMonoid(by, Monoids_1.Max);
    }
    min() {
        return this.foldWithMonoid(Monoids_1.Min);
    }
    minBy(by) {
        return this.foldByWithMonoid(by, Monoids_1.Min);
    }
    sum() {
        return this.foldWithMonoid(Monoids_1.Sum);
    }
    sumBy(by) {
        return this.foldByWithMonoid(by, Monoids_1.Sum);
    }
    product() {
        return this.foldWithMonoid(Monoids_1.Product);
    }
    productBy(by) {
        return this.foldByWithMonoid(by, Monoids_1.Product);
    }
    //endregion
    //region Grouping
    groupBy(computeKey) {
        return ArrayFunctions_1.groupItemsBy(this.items, computeKey);
    }
    //endregion
    //region Mapping
    map(f) {
        return new NonEmptyList(ArrayFunctions_1.mapItems(this.items, f));
    }
    parallelMap(f) {
        return ArrayFunctions_1.parallelMapItems(this.items, f);
    }
    //endregion
    //region Search
    find(predicate) {
        return ArrayFunctions_1.findItem(this.items, predicate);
    }
    findLast(predicate) {
        return ArrayFunctions_1.findLastItem(this.items, predicate);
    }
    //endregion
    //region Side-effects
    perform(sideEffect) {
        sideEffect(this);
    }
    forEach(sideEffect) {
        ArrayFunctions_1.forEachItem(this.items, sideEffect);
    }
    //endregion
    //region Status
    size() {
        return this.length;
    }
    //endregion
    //region Sorting
    sort() {
        return new NonEmptyList(ArrayFunctions_1.sortItems(this.items));
    }
    sortBy(by) {
        return new NonEmptyList(ArrayFunctions_1.sortItemsBy(this.items, by));
    }
    sortDescendingly() {
        return new NonEmptyList(ArrayFunctions_1.sortItemsDescendingly(this.items));
    }
    sortDescendinglyBy(by) {
        return new NonEmptyList(ArrayFunctions_1.sortItemsDescendinglyBy(this.items, by));
    }
    //endregion
    //region Testing
    contains(item) {
        return ArrayFunctions_1.containsItem(this.items, item);
    }
    equals(otherList) {
        if (otherList == null) {
            return false;
        }
        return ArrayFunctions_1.equalItems(this.items, otherList.getArray());
    }
    all(predicate) {
        return ArrayFunctions_1.allItems(this.items, predicate);
    }
    some(predicate) {
        return ArrayFunctions_1.someItem(this.items, predicate);
    }
    none(predicate) {
        return ArrayFunctions_1.noItems(this.items, predicate);
    }
    count(predicate) {
        return ArrayFunctions_1.countItems(this.items, predicate);
    }
}
exports.NonEmptyList = NonEmptyList;
function nonEmptyList(head, ...tail) {
    const array = new Array(tail.length + 1);
    array[0] = head;
    for (let i = 0; i < tail.length; i++) {
        array[i + 1] = tail[i];
    }
    return new NonEmptyList(array);
}
exports.nonEmptyList = nonEmptyList;
function inclusiveRange(start, end) {
    if (end == null) {
        if (start >= 0) {
            return nonEmptyList(0, ...ArrayFunctions_1.rangeOfItems(1, start + 1));
        }
        else {
            return nonEmptyList(0, ...ArrayFunctions_1.rangeOfItems(-1, start - 1));
        }
    }
    else {
        if (end >= start) {
            return nonEmptyList(start, ...ArrayFunctions_1.rangeOfItems(start + 1, end + 1));
        }
        else {
            return nonEmptyList(start, ...ArrayFunctions_1.rangeOfItems(start - 1, end - 1));
        }
    }
}
exports.inclusiveRange = inclusiveRange;
//# sourceMappingURL=NonEmptyList.js.map