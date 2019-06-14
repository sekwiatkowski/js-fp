"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Equality_1 = require("./Equality");
const Equivalence_1 = require("./Equivalence");
const sameLength = Equality_1.NumberEquality.mapParameters((array) => array.length);
function createSameItemsEquality(itemEquality) {
    return Equivalence_1.equivalence((xs, ys) => xs.every((x, i) => itemEquality.test(x, ys[i])));
}
function createArrayEquality(itemEquality) {
    return Equality_1.noItemIsUndefinedOrNull.and(sameLength.and(createSameItemsEquality(itemEquality)));
}
exports.createArrayEquality = createArrayEquality;
function createNullableArrayEquality(itemEquality) {
    return Equality_1.bothAreNull.or(createArrayEquality(itemEquality));
}
exports.createNullableArrayEquality = createNullableArrayEquality;
exports.StringArrayEquality = createArrayEquality(Equality_1.StringEquality);
exports.NumberArrayEquality = createArrayEquality(Equality_1.NumberEquality);
exports.BooleanArrayEquality = createArrayEquality(Equality_1.BooleanEquality);
exports.DateArrayEquality = createArrayEquality(Equality_1.DateEquality);
exports.NullableStringArrayEquality = createNullableArrayEquality(Equality_1.NullableStringEquality);
exports.NullableNumberArrayEquality = createNullableArrayEquality(Equality_1.NullableNumberEquality);
exports.NullableBooleanArrayEquality = createNullableArrayEquality(Equality_1.NullableBooleanEquality);
exports.NullableDateArrayEquality = createNullableArrayEquality(Equality_1.NullableDateEquality);
//# sourceMappingURL=ArrayEquality.js.map