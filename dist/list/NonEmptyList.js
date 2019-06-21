"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
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
        return new NonEmptyList(ArrayFunctions_1.flatten(this.getArray()));
    }
    chain(f) {
        return this.map(f).flatten();
    }
    //endregion
    //region Combination
    concat(otherList) {
        return new NonEmptyList(__1.ArrayConcatenation.combine(this.items)(otherList.items));
    }
    combine(other, semigroup) {
        if (other instanceof Array) {
            return new NonEmptyList(semigroup.combine(this.items)(other));
        }
        else {
            return semigroup.combine(this)(other);
        }
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
    //region Folding
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
        return this.foldWithMonoid(__1.Max);
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
    filter(predicate) {
        return new __1.List(ArrayFunctions_1.filterItems(this.items, __1.ensurePredicateFunction(predicate)));
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
    sort(order = __1.AnyOrder) {
        return new __1.List(ArrayFunctions_1.sortItems(this.items, order.get()));
    }
    sortBy(by) {
        return new __1.List(ArrayFunctions_1.sortItems(this.items, __1.orderBy(by).get()));
    }
    sortDescendingly() {
        return new __1.List(ArrayFunctions_1.sortItems(this.items, __1.DescendingAnyOrder.get()));
    }
    sortDescendinglyBy(by) {
        return new __1.List(ArrayFunctions_1.sortItems(this.items, __1.orderDescendinglyBy(by).get()));
    }
    //endregion
    //region Testing
    contains(item, itemEquality = __1.guardedStrictEquality) {
        return ArrayFunctions_1.containsItem(this.items, item, __1.ensureEquivalenceFunction(itemEquality));
    }
    equals(otherList, equality) {
        return equality.test(this, otherList);
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
exports.NonEmptyList = NonEmptyList;
function list(head, ...tail) {
    const array = new Array(tail.length + 1);
    array[0] = head;
    for (let i = 0; i < tail.length; i++) {
        array[i + 1] = tail[i];
    }
    return new NonEmptyList(array);
}
exports.list = list;
function inclusiveRange(start, end) {
    if (end == null) {
        if (start >= 0) {
            return list(0, ...ArrayFunctions_1.rangeOfItems(1, start + 1));
        }
        else {
            return list(0, ...ArrayFunctions_1.rangeOfItems(-1, start - 1));
        }
    }
    else {
        if (end >= start) {
            return list(start, ...ArrayFunctions_1.rangeOfItems(start + 1, end + 1));
        }
        else {
            return list(start, ...ArrayFunctions_1.rangeOfItems(start - 1, end - 1));
        }
    }
}
exports.inclusiveRange = inclusiveRange;
function createNonEmptyListEquality(itemEquality = __1.guardedStrictEquality) {
    return __1.neitherIsUndefinedOrNull.and(__1.createArrayEquality(itemEquality).adapt(l => l.getArray()));
}
exports.createNonEmptyListEquality = createNonEmptyListEquality;
//# sourceMappingURL=NonEmptyList.js.map