"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
function createValidatedEquality(valueEquality = __1.guardedStrictEquality, errorsEquality = __1.createArrayEquality(__1.guardedStrictEquality)) {
    return __1.neitherIsUndefinedOrNull.and(__1.equivalence((validatedX, resultY) => (validatedX.match(valueX => resultY.match(valueY => valueEquality.test(valueX, valueY), _ => false), errorsX => resultY.match(_ => false, errorY => errorsEquality.test(errorsX, errorY))))));
}
exports.createValidatedEquality = createValidatedEquality;
//# sourceMappingURL=Validated.js.map