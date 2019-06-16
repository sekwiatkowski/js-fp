"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Context {
    constructor(f) {
        this.f = f;
    }
    //region Access
    get() {
        return this.f;
    }
    //endregion
    //region Chaining
    chain(g) {
        return new Context(shared => {
            const first = this.f(shared);
            return g(first).runWith(shared);
        });
    }
    //endregion
    //region Comprehension
    assign(key, memberOrContextOrFunction) {
        return new Context(shared => {
            const scope = this.f(shared);
            const memberOrContext = memberOrContextOrFunction instanceof Function ? memberOrContextOrFunction(scope) : memberOrContextOrFunction;
            const member = memberOrContext instanceof Context ? memberOrContext.runWith(shared) : memberOrContext;
            return Object.assign({}, Object(scope), { [key]: member });
        });
    }
    assignWithContext(key, memberOrContextOrFunction) {
        return new Context(shared => {
            const scope = this.f(shared);
            const memberOrContext = memberOrContextOrFunction instanceof Function ? memberOrContextOrFunction(shared, scope) : memberOrContextOrFunction;
            const member = memberOrContext instanceof Context ? memberOrContext.runWith(shared) : memberOrContext;
            return Object.assign({}, Object(scope), { [key]: member });
        });
    }
    //endregion
    //region Execution
    runWith(shared) {
        return this.f(shared);
    }
    //endregion
    //region Mapping
    map(g) {
        return new Context((shared) => g(this.f(shared)));
    }
    //endregion Mapping
    //region Side-effects
    perform(sideEffect) {
        return new Context(shared => {
            const scope = this.f(shared);
            sideEffect(scope);
            return scope;
        });
    }
    performWithContext(sideEffect) {
        return new Context(shared => {
            const scope = this.f(shared);
            sideEffect(shared, scope);
            return scope;
        });
    }
    //endregion
    //region Testing
    equals(other, equality) {
        return new ContextualTest(shared => {
            return (equality || __1.guardedStrictEquality).test(this.f(shared), other);
        });
    }
    test(predicate) {
        return new ContextualTest(shared => {
            const predicateFunction = __1.ensurePredicateFunction(predicate);
            return predicateFunction(this.f(shared));
        });
    }
}
exports.Context = Context;
exports.context = (f) => new Context(f);
exports.contextualObject = () => exports.context(() => ({}));
class ContextualTest {
    constructor(f) {
        this.f = f;
    }
    runWith(shared) {
        return this.f(shared);
    }
}
//# sourceMappingURL=Context.js.map