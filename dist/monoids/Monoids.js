"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Max = {
    combine: (a) => (b) => Math.max(a, b),
    identityElement: -Infinity
};
exports.Min = {
    combine: (a) => (b) => Math.min(a, b),
    identityElement: +Infinity
};
exports.Sum = {
    combine: (a) => (b) => a + b,
    identityElement: 0
};
exports.Product = {
    combine: (a) => (b) => a * b,
    identityElement: 1
};
exports.ArrayConcatenation = {
    combine: (a) => (b) => a.concat(b),
    identityElement: []
};
//# sourceMappingURL=Monoids.js.map