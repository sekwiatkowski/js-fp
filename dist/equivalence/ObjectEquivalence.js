"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Equivalence_1 = require("./Equivalence");
exports.objectEquivalence = (equivalences) => Equivalence_1.equivalence((x, y) => {
    for (const [key, memberEquivalence] of Object.entries(equivalences)) {
        const xMember = x[key];
        const yMember = y[key];
        if (memberEquivalence instanceof Equivalence_1.Equivalence) {
            if (!memberEquivalence.test(xMember, yMember)) {
                return false;
            }
        }
    }
    return true;
});
//# sourceMappingURL=ObjectEquivalence.js.map