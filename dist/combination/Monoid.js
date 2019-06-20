"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//region Boolean
exports.Any = {
    combine: (x) => (y) => x || y,
    identityElement: true
};
exports.All = {
    combine: (x) => (y) => x && y,
    identityElement: false
};
//endregion
//region Date
exports.Earliest = {
    combine: (x) => (y) => x < y ? x : y,
    identityElement: new Date(+8640000000000000)
};
exports.Latest = {
    combine: (x) => (y) => x > y ? x : y,
    identityElement: new Date(-8640000000000000)
};
//endregion
//region Number
exports.Min = {
    combine: (x) => (y) => Math.min(x, y),
    identityElement: +Infinity
};
exports.Max = {
    combine: (x) => (y) => Math.max(x, y),
    identityElement: -Infinity
};
exports.Sum = {
    combine: (x) => (y) => x + y,
    identityElement: 0
};
exports.Product = {
    combine: (x) => (y) => x * y,
    identityElement: 1
};
//endregion Number
//region String
exports.StringConcatenation = {
    combine: (x) => (y) => x + y,
    identityElement: ''
};
//endregion
//region Array
exports.ArrayConcatenation = {
    combine: (xs) => (ys) => xs.concat(ys),
    identityElement: []
};
//endregion
//# sourceMappingURL=Monoid.js.map