"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Pair {
    constructor(_first, _second) {
        this._first = _first;
        this._second = _second;
    }
    //region Access
    first() {
        return this._first;
    }
    second() {
        return this._second;
    }
    //endregion
    //region Chaining
    chain(f) {
        return f(this._first, this._second);
    }
    //endregion
    //region Conversion
    toArray() {
        return [this._first, this._second];
    }
    toBox(f) {
        return __1.box(f(this._first, this._second));
    }
    //endregion
    //region Mapping
    bimap(fa, fb) {
        return new Pair(fa(this._first), fb(this._second));
    }
    mapFirst(f) {
        return new Pair(f(this._first), this._second);
    }
    mapSecond(f) {
        return new Pair(this._first, f(this._second));
    }
    //endregion
    //region Side-effects
    perform(sideEffect) {
        sideEffect(this._first, this._second);
        return new Pair(this._first, this._second);
    }
    performOnFirst(sideEffect) {
        sideEffect(this._first);
        return new Pair(this._first, this._second);
    }
    performOnSecond(sideEffect) {
        sideEffect(this._second);
        return new Pair(this._first, this._second);
    }
    //endregion
    //region Testing
    equals(otherPair, equality) {
        return (equality || exports.PairEquality).test(this, otherPair);
    }
    test(predicate) {
        if (predicate instanceof Function) {
            return predicate(this.toArray());
        }
        else {
            return predicate.test(this.toArray());
        }
    }
}
exports.Pair = Pair;
function pair(first, second) {
    return new Pair(first, second);
}
exports.pair = pair;
exports.PairEquality = __1.neitherIsUndefinedOrNull.and(__1.equivalence((pair1, pair2) => __1.guardedStrictEquality.test(pair1.first(), pair2.first()) &&
    __1.guardedStrictEquality.test(pair1.second(), pair2.second())));
//# sourceMappingURL=Pair.js.map