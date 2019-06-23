"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
function createSettledEquality(valueEquality = __1.guardedStrictEquality, errorEquality = __1.guardedStrictEquality) {
    return __1.neitherIsUndefinedOrNull
        .and(__1.equivalence((thisSettled, otherSettled) => thisSettled.match(thisValue => otherSettled.match(otherValue => valueEquality.test(thisValue, otherValue), () => false), thisError => otherSettled.match(() => false, otherError => errorEquality.test(thisError, otherError)))));
}
exports.createSettledEquality = createSettledEquality;
//# sourceMappingURL=Settled.js.map