"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = (a, b) => {
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
exports.negatedCompare = (a, b) => -exports.compare(a, b);
exports.compareBy = (a, b, f) => exports.compare(f(a), f(b));
exports.negatedCompareBy = (a, b, f) => -exports.compareBy(a, b, f);
//# sourceMappingURL=Comparison.js.map