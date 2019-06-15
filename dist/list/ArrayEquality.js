"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const sameLength = __1.NumberEquality.adapt((array) => array.length);
function createSameItemsEquality(itemEquality) {
    return __1.equivalence((xs, ys) => xs.every((x, i) => itemEquality.test(x, ys[i])));
}
function createArrayEquality(itemEquality) {
    return __1.neitherIsUndefinedOrNull.and(sameLength.and(createSameItemsEquality(itemEquality)));
}
exports.createArrayEquality = createArrayEquality;
exports.StringArrayEquality = createArrayEquality(__1.StringEquality);
exports.NumberArrayEquality = createArrayEquality(__1.NumberEquality);
exports.BooleanArrayEquality = createArrayEquality(__1.BooleanEquality);
exports.DateArrayEquality = createArrayEquality(__1.DateEquality);
function createNullableArrayEquality(itemEquality) {
    return __1.bothAreNull.or(createArrayEquality(itemEquality));
}
exports.createNullableArrayEquality = createNullableArrayEquality;
exports.NullableStringArrayEquality = createNullableArrayEquality(__1.NullableStringEquality);
exports.NullableNumberArrayEquality = createNullableArrayEquality(__1.NullableNumberEquality);
exports.NullableBooleanArrayEquality = createNullableArrayEquality(__1.NullableBooleanEquality);
exports.NullableDateArrayEquality = createNullableArrayEquality(__1.NullableDateEquality);
//# sourceMappingURL=ArrayEquality.js.map