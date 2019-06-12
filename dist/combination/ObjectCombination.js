"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectCombination = (semigroups) => ({
    combine: (a) => (b) => {
        return Object.keys(semigroups).reduce((combinedObject, key) => {
            combinedObject[key] = semigroups[key].combine(a[key])(b[key]);
            return combinedObject;
        }, {});
    }
});
//# sourceMappingURL=ObjectCombination.js.map