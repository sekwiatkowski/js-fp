"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Arrow {
    constructor(f) {
        this.f = f;
    }
    compose(arrowOrFunction) {
        if (arrowOrFunction instanceof Function) {
            return new Arrow((input) => arrowOrFunction(this.f(input)));
        }
        else {
            return new Arrow((input) => arrowOrFunction.apply((this.f(input))));
        }
    }
    adapt(map) {
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