"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const Monoids_1 = require("../monoids/Monoids");
const ArrayFunctions_1 = require("./ArrayFunctions");
const NonEmptyList_1 = require("./NonEmptyList");
class List {
    constructor(items) {
        this.items = items;
        this.length = items.length;
    }
    //region Access
    first() {
        return ArrayFunctions_1.getItem(this.items, 0);
    }
    get(index) {
        return ArrayFunctions_1.getItem(this.items, index);
    }
    getArray() {
        return this.items;
    }
    getOrElse(index, alternative) {
        return ArrayFunctions_1.getItemOrElse(this.items, index, alternative);
    }
    last() {
        return ArrayFunctions_1.getItem(this.items, this.length - 1);
    }
    take(n) {
        return new List(ArrayFunctions_1.takeItems(this.items, n));
    }
    //endregion
    //region Chaining
    flatten() {
        return new List(ArrayFunctions_1.flatten(this.items));
    }
    chain(f) {
        return this.map(f).flatten();
    }
    //endregion
    //region Combination
    concat(otherList) {
        return new List(Monoids_1.ArrayConcatenation.combine(this.items)(otherList.items));
    }
    //endregion
    //region Expansion
    append(item) {
        return new NonEmptyList_1.NonEmptyList(ArrayFunctions_1.appendItem(this.items, item));
    }
    prepend(item) {
        return new NonEmptyList_1.NonEmptyList(ArrayFunctions_1.prependItem(this.items, item));
    }
    //endregion
    //region Filtering
    filter(predicate) {
        return new List(ArrayFunctions_1.filterItems(this.items, predicate));
    }
    //endregion
    //region Folding
    foldBy(by, operation, initialValue) {
        if (this.length == 0) {
            return __1.none;
        }
        else {
            return __1.some(ArrayFunctions_1.foldItemsBy(this.items, by, operation, initialValue));
        }
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
        return new List(ArrayFunctions_1.mapItems(this.items, f));
    }
    parallelMap(f) {
        return ArrayFunctions_1.parallelMapItems(this.items, f);
    }
    //endregion
    //region Matching
    match(onNonEmpty, onEmpty) {
        return this.length == 0 ? onEmpty() : onNonEmpty(this.items);
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
    forEach(sideEffect) {
        ArrayFunctions_1.forEachItem(this.items, sideEffect);
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
        return new List(ArrayFunctions_1.sortItems(this.items));
    }
    sortBy(by) {
        return new List(ArrayFunctions_1.sortItemsBy(this.items, by));
    }
    sortDescendingly() {
        return new List(ArrayFunctions_1.sortItemsDescendingly(this.items));
    }
    sortDescendinglyBy(by) {
        return new List(ArrayFunctions_1.sortItemsDescendinglyBy(this.items, by));
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
exports.List = List;
function list(...items) {
    return new List(items);
}
exports.list = list;
function emptyList() {
    return list();
}
exports.emptyList = emptyList;
function listFromArray(array) {
    return list(...array);
}
exports.listFromArray = listFromArray;
function range(start, end) {
    return listFromArray(ArrayFunctions_1.rangeOfItems(start, end));
}
exports.range = range;
function repeat(times, valueOrFunction) {
    return listFromArray(ArrayFunctions_1.repeatItems(times, valueOrFunction));
}
exports.repeat = repeat;
//# sourceMappingURL=List.js.map