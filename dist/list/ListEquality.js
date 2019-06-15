"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
function createListEquality(itemEquality) {
    return __1.neitherIsUndefinedOrNull.and(__1.createArrayEquality(itemEquality).adapt(l => l.getArray()));
}
exports.createListEquality = createListEquality;
exports.strictListEquality = createListEquality(__1.strictEquality);
function createNonEmptyListEquality(itemEquality) {
    return __1.neitherIsUndefinedOrNull.and(__1.createArrayEquality(itemEquality).adapt(l => l.getArray()));
}
exports.createNonEmptyListEquality = createNonEmptyListEquality;
exports.strictNonEmptyListEquality = createNonEmptyListEquality(__1.strictEquality);
//# sourceMappingURL=ListEquality.js.map