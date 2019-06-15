"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const Equality_1 = require("../equivalence/Equality");
exports.anyValidatedEquality = __1.neitherIsUndefinedOrNull.and(__1.equivalence((validatedX, validatedY) => (validatedX.match(valueX => validatedY.match(successY => Equality_1.strictEquality.test(valueX, successY), _ => false), errorsX => validatedY.match(_ => false, errorsY => __1.createArrayEquality().test(errorsX, errorsY))))));
//# sourceMappingURL=Validated.js.map