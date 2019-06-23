"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Equivalence_1 = require("./Equivalence");
const isUndefined = (x) => x == undefined;
const isNull = (x) => x === null;
const eitherIsUndefined = Equivalence_1.equivalence((x, y) => isUndefined(x) || isUndefined(y));
const eitherIsNull = Equivalence_1.equivalence((x, y) => isNull(x) || isNull(y));
exports.neitherIsUndefinedOrNull = eitherIsUndefined.or(eitherIsNull).not();
exports.strictEquality = Equivalence_1.equivalence((x, y) => x === y);
exports.guardedStrictEquality = exports.neitherIsUndefinedOrNull.and(exports.strictEquality);
exports.StringEquality = exports.guardedStrictEquality;
exports.NumberEquality = exports.guardedStrictEquality;
exports.BooleanEquality = exports.guardedStrictEquality;
exports.DateEquality = exports.neitherIsUndefinedOrNull
    .and(exports.strictEquality.adapt(date => date.valueOf()));
exports.bothAreNull = Equivalence_1.equivalence((x, y) => isNull(x) && isNull(y));
exports.nullableStrictEquality = exports.bothAreNull.or(exports.guardedStrictEquality);
exports.NullableStringEquality = exports.nullableStrictEquality;
exports.NullableNumberEquality = exports.nullableStrictEquality;
exports.NullableBooleanEquality = exports.nullableStrictEquality;
exports.NullableDateEquality = exports.bothAreNull.or(exports.DateEquality);
//# sourceMappingURL=Equality.js.map