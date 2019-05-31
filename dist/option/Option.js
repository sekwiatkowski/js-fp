"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Some_1 = require("./Some");
const None_1 = require("./None");
function option(valueOrFunction) {
    const nullable = valueOrFunction instanceof Function ? valueOrFunction() : valueOrFunction;
    return nullable != null ? Some_1.some(nullable) : None_1.none;
}
exports.option = option;
//# sourceMappingURL=Option.js.map