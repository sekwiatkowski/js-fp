"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Max = {
    operation: (a) => (b) => Math.max(a, b),
    identityElement: -Infinity
};
exports.Min = {
    operation: (a) => (b) => Math.min(a, b),
    identityElement: +Infinity
};
exports.Sum = {
    operation: (a) => (b) => a + b,
    identityElement: 0
};
exports.Product = {
    operation: (a) => (b) => a * b,
    identityElement: 1
};
//# sourceMappingURL=Monoids.js.map