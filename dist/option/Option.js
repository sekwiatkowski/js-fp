"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Some_1 = require("./Some");
const None_1 = require("./None");
const __1 = require("..");
function option(valueOrFunction) {
    const nullable = valueOrFunction instanceof Function ? valueOrFunction() : valueOrFunction;
    return nullable == null ? None_1.none : Some_1.some(nullable);
}
exports.option = option;
function createOptionEquality(itemEquality = __1.guardedStrictEquality) {
    return __1.neitherIsUndefinedOrNull.and(__1.equivalence((optionX, optionY) => (optionX.match(x => optionY.match(y => itemEquality.test(x, y), () => false), () => false))));
}
exports.createOptionEquality = createOptionEquality;
//# sourceMappingURL=Option.js.map