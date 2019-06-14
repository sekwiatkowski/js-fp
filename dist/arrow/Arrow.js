"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Arrow {
    constructor(f) {
        this.f = f;
    }
    compose(other) {
        return new Arrow((input) => other.apply((this.f(input))));
    }
    map(g) {
        return new Arrow((input) => g(this.f(input)));
    }
    mapInput(map) {
        return new Arrow((input) => this.f(map(input)));
    }
    apply(input) {
        return this.f(input);
    }
    get() {
        return this.f;
    }
}
exports.Arrow = Arrow;
exports.arrow = (f) => new Arrow(f);
//# sourceMappingURL=Arrow.js.map