"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Action {
    constructor(f) {
        this.f = f;
    }
    andThen(arrowOrFunction) {
        return new Action(() => (arrowOrFunction instanceof Function ? arrowOrFunction : arrowOrFunction.get())(this.f()));
    }
    act() {
        return this.f();
    }
}
exports.Action = Action;
exports.action = (f) => new Action(f);
//# sourceMappingURL=Action.js.map