"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Equivalence {
    constructor(f) {
        this.f = f;
    }
    test(x, y) {
        const result = this.f(x, y);
        return result;
    }
    get() {
        return this.f;
    }
    mapParameters(f) {
        return new Equivalence((x, y) => this.test(f(x), f(y)));
    }
    and(other) {
        return new Equivalence((x, y) => this.test(x, y) && other.test(x, y));
    }
    or(other) {
        return new Equivalence((x, y) => this.test(x, y) || other.test(x, y));
    }
    not() {
        return new Equivalence((x, y) => !this.test(x, y));
    }
}
exports.Equivalence = Equivalence;
exports.equivalence = (test) => new Equivalence(test);
//# sourceMappingURL=Equivalence.js.map