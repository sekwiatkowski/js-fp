"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Equivalence_1 = require("./Equivalence");
const isUndefined = (x) => typeof x === 'undefined';
const isNull = (x) => x === null;
const eitherIsUndefined = Equivalence_1.equivalence((x, y) => isUndefined(x) || isUndefined(y));
const eitherIsNull = Equivalence_1.equivalence((x, y) => isNull(x) || isNull(y));
exports.noItemIsUndefinedOrNull = eitherIsUndefined.or(eitherIsNull).not();
const basicStrictEquality = Equivalence_1.equivalence((x, y) => x === y);
const strictEquality = exports.noItemIsUndefinedOrNull.and(basicStrictEquality);
exports.StringEquality = strictEquality;
exports.NumberEquality = strictEquality;
exports.BooleanEquality = strictEquality;
exports.DateEquality = exports.noItemIsUndefinedOrNull
    .and(basicStrictEquality.mapParameters(date => date.valueOf()));
exports.bothAreNull = Equivalence_1.equivalence((x, y) => isNull(x) && isNull(y));
const nullableStrictEquality = exports.bothAreNull.or(strictEquality);
exports.NullableStringEquality = nullableStrictEquality;
exports.NullableNumberEquality = nullableStrictEquality;
exports.NullableBooleanEquality = nullableStrictEquality;
exports.NullableDateEquality = exports.bothAreNull.or(exports.DateEquality);
//# sourceMappingURL=Equality.js.map