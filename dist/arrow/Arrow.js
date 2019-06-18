"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Arrow {
    constructor(f) {
        this.f = f;
    }
    andThen(arrowOrFunction) {
        return new Arrow((input) => {
            const g = arrowOrFunction instanceof Function ? arrowOrFunction : arrowOrFunction.get();
            return g(this.f(input));
        });
    }
    adapt(adaptor) {
        return new Arrow((input) => this.f(adaptor(input)));
    }
    apply(input) {
        return __1.box(this.f(input));
    }
    get() {
        return this.f;
    }
}
exports.Arrow = Arrow;
exports.arrow = (f) => new Arrow(f);
//# sourceMappingURL=Arrow.js.map