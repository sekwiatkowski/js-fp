"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const Equality_1 = require("../equivalence/Equality");
exports.anyResultEquality = __1.neitherIsUndefinedOrNull.and(__1.equivalence((resultX, resultY) => (resultX.match(valueX => resultY.match(valueY => Equality_1.strictEquality.test(valueX, valueY), _ => false), errorX => resultY.match(_ => false, errorY => Equality_1.strictEquality.test(errorX, errorY))))));
//# sourceMappingURL=Result.js.map