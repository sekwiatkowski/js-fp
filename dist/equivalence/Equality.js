"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Equivalence_1 = require("./Equivalence");
const isUndefined = x => typeof x === 'undefined';
const isNull = x => x === null;
const eitherIsUndefined = Equivalence_1.equivalence((x, y) => isUndefined(x) || isUndefined(y));
const eitherIsNull = Equivalence_1.equivalence((x, y) => isNull(x) || isNull(y));
exports.neitherIsUndefinedOrNull = eitherIsUndefined.or(eitherIsNull).not();
const basicStrictEquality = Equivalence_1.equivalence((x, y) => x === y);
exports.strictEquality = exports.neitherIsUndefinedOrNull.and(basicStrictEquality);
exports.StringEquality = exports.strictEquality;
exports.NumberEquality = exports.strictEquality;
exports.BooleanEquality = exports.strictEquality;
exports.DateEquality = exports.neitherIsUndefinedOrNull
    .and(basicStrictEquality.adapt(date => date.valueOf()));
exports.bothAreNull = Equivalence_1.equivalence((x, y) => isNull(x) && isNull(y));
exports.nullableStrictEquality = exports.bothAreNull.or(exports.strictEquality);
exports.NullableStringEquality = exports.nullableStrictEquality;
exports.NullableNumberEquality = exports.nullableStrictEquality;
exports.NullableBooleanEquality = exports.nullableStrictEquality;
exports.NullableDateEquality = exports.bothAreNull.or(exports.DateEquality);
//# sourceMappingURL=Equality.js.map