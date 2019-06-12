"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//region Boolean
exports.Any = {
    combine: (a) => (b) => a || b,
    identityElement: true
};
exports.All = {
    combine: (a) => (b) => a && b,
    identityElement: false
};
//endregion
//region Date
exports.Earliest = {
    combine: (a) => (b) => a < b ? a : b,
    identityElement: new Date(+8640000000000000)
};
exports.Latest = {
    combine: (a) => (b) => a > b ? a : b,
    identityElement: new Date(-8640000000000000)
};
//endregion
//region Number
exports.Min = {
    combine: (a) => (b) => Math.min(a, b),
    identityElement: +Infinity
};
exports.Max = {
    combine: (a) => (b) => Math.max(a, b),
    identityElement: -Infinity
};
exports.Sum = {
    combine: (a) => (b) => a + b,
    identityElement: 0
};
exports.Product = {
    combine: (a) => (b) => a * b,
    identityElement: 1
};
//endregion Number
//region Array
exports.ArrayConcatenation = {
    combine: (a) => (b) => a.concat(b),
    identityElement: []
};
//endregion
//# sourceMappingURL=Monoid.js.map