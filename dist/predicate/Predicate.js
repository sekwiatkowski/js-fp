"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Predicate {
    constructor(f) {
        this.f = f;
    }
    test(x) {
        return this.f(x);
    }
    get() {
        return this.f;
    }
    adapt(f) {
        return new Predicate((x) => this.test(f(x)));
    }
    and(other) {
        return new Predicate((x) => this.test(x) && other.test(x));
    }
    or(other) {
        return new Predicate((x) => this.test(x) || other.test(x));
    }
    not() {
        return new Predicate((x) => !this.test(x));
    }
}
exports.Predicate = Predicate;
exports.predicate = (test) => new Predicate(test);
exports.ensurePredicateFunction = (predicate) => predicate instanceof Function ? predicate : predicate.get();
//# sourceMappingURL=Predicate.js.map