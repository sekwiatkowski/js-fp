"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
function createResultEquality(valueEquality = __1.guardedStrictEquality, errorEquality = __1.guardedStrictEquality) {
    return __1.neitherIsUndefinedOrNull.and(__1.equivalence((resultX, resultY) => (resultX.match(valueX => resultY.match(valueY => valueEquality.test(valueX, valueY), _ => false), errorX => resultY.match(_ => false, errorY => errorEquality.test(errorX, errorY))))));
}
exports.createResultEquality = createResultEquality;
//# sourceMappingURL=Result.js.map