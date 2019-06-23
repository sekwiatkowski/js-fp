"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Pair {
    constructor(_first, _second) {
        this._first = _first;
        this._second = _second;
    }
    first(f) {
        if (f) {
            return f(this._first);
        }
        else {
            return this._first;
        }
    }
    second(f) {
        if (f) {
            return f(this._second);
        }
        else {
            return this._second;
        }
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
        return equality.test(this, otherPair);
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
function createPairEquality(firstEquality = __1.guardedStrictEquality, secondEquality = __1.guardedStrictEquality) {
    return __1.neitherIsUndefinedOrNull.and(__1.equivalence((firstPair, secondPair) => firstEquality.test(firstPair.first(), secondPair.first()) &&
        secondEquality.test(firstPair.second(), secondPair.second())));
}
exports.createPairEquality = createPairEquality;
//# sourceMappingURL=Pair.js.map