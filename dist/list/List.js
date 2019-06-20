"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const ArrayFunctions_1 = require("./ArrayFunctions");
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
    concat(other) {
        return new List(__1.ArrayConcatenation.combine(this.getArray())(other instanceof Array ? other : other.getArray()));
    }
    combine(other, semigroup) {
        if (other instanceof Array) {
            return new List(semigroup.combine(this.items)(other));
        }
        else {
            return semigroup.combine(this)(other);
        }
    }
    //endregion
    //region Expansion
    append(item) {
        return new __1.NonEmptyList(ArrayFunctions_1.appendItem(this.items, item));
    }
    prepend(item) {
        return new __1.NonEmptyList(ArrayFunctions_1.prependItem(this.items, item));
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
    //region Reduction
    reduceBy(by, operation) {
        if (this.length < 2) {
            return __1.none;
        }
        else {
            return __1.some(ArrayFunctions_1.reduceItemsBy(this.items, by, operation));
        }
    }
    reduce(operation) {
        return this.reduceBy(x => x, operation);
    }
    reduceByWithSemigroup(by, semigroup) {
        return this.reduceBy(by, semigroup.combine);
    }
    reduceWithSemigroup(semigroup) {
        return this.reduce(semigroup.combine);
    }
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
    foldByWithMonoid(by, monoid) {
        return this.foldBy(by, monoid.combine, monoid.identityElement);
    }
    foldWithMonoid(monoid) {
        return this.fold(monoid.combine, monoid.identityElement);
    }
    earliest() {
        return this.foldWithMonoid(__1.Earliest);
    }
    earliestBy(by) {
        return this.foldByWithMonoid(by, __1.Earliest);
    }
    latest() {
        return this.foldWithMonoid(__1.Latest);
    }
    latestBy(by) {
        return this.foldByWithMonoid(by, __1.Latest);
    }
    max() {
        return this.foldWithMonoid(__1.Max);
    }
    maxBy(by) {
        return this.foldByWithMonoid(by, __1.Max);
    }
    min() {
        return this.foldWithMonoid(__1.Min);
    }
    minBy(by) {
        return this.foldByWithMonoid(by, __1.Min);
    }
    sum() {
        return this.foldWithMonoid(__1.Sum);
    }
    sumBy(by) {
        return this.foldByWithMonoid(by, __1.Sum);
    }
    product() {
        return this.foldWithMonoid(__1.Product);
    }
    productBy(by) {
        return this.foldByWithMonoid(by, __1.Product);
    }
    //endregion
    //region Search
    filter(predicate) {
        return new List(ArrayFunctions_1.filterItems(this.items, __1.ensurePredicateFunction(predicate)));
    }
    find(predicate) {
        return ArrayFunctions_1.findItem(this.items, __1.ensurePredicateFunction(predicate));
    }
    findLast(predicate) {
        return ArrayFunctions_1.findLastItem(this.items, __1.ensurePredicateFunction(predicate));
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
    sort(order = __1.AnyOrder) {
        return new List(ArrayFunctions_1.sortItems(this.items, order.get()));
    }
    sortBy(by) {
        return new List(ArrayFunctions_1.sortItems(this.items, __1.orderBy(by).get()));
    }
    sortDescendingly() {
        return new List(ArrayFunctions_1.sortItems(this.items, __1.DescendingAnyOrder.get()));
    }
    sortDescendinglyBy(by) {
        return new List(ArrayFunctions_1.sortItems(this.items, __1.orderDescendinglyBy(by).get()));
    }
    //endregion
    //region Testing
    contains(item, itemEquality = __1.guardedStrictEquality) {
        return ArrayFunctions_1.containsItem(this.items, item, __1.ensureEquivalenceFunction(itemEquality));
    }
    equals(otherList, equality) {
        return (equality || exports.anyListEquality).test(this, otherList);
    }
    all(predicate) {
        return ArrayFunctions_1.allItems(this.items, __1.ensurePredicateFunction(predicate));
    }
    some(predicate) {
        return ArrayFunctions_1.someItem(this.items, __1.ensurePredicateFunction(predicate));
    }
    none(predicate) {
        return ArrayFunctions_1.noItems(this.items, __1.ensurePredicateFunction(predicate));
    }
    count(predicate) {
        return ArrayFunctions_1.countItems(this.items, __1.ensurePredicateFunction(predicate));
    }
    test(predicate) {
        if (predicate instanceof Function) {
            return predicate(this.items);
        }
        else {
            return predicate.test(this.items);
        }
    }
}
exports.List = List;
function emptyList() {
    return new List([]);
}
exports.emptyList = emptyList;
function listFromArray(array) {
    return new List(array);
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
exports.anyListEquality = __1.neitherIsUndefinedOrNull.and(__1.createArrayEquality().adapt(l => l.getArray()));
exports.ListConcatenation = {
    combine: (xs) => (ys) => new List(__1.ArrayConcatenation.combine(xs.getArray())(ys.getArray())),
    identityElement: emptyList()
};
//# sourceMappingURL=List.js.map