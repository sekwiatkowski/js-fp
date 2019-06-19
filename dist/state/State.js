"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class State {
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
        return new State((firstState) => {
            const secondState = this.f(firstState);
            return g(secondState.second()).runWith(secondState.first());
        });
    }
    //endregion
    //region Execution
    runWith(state) {
        return this.f(state);
    }
    evaluateWith(state) {
        return this.runWith(state).second();
    }
    //endregion
    //region Comprehension
    assign(key, memberOrStateOrFunction) {
        return new State(state => {
            const objectLevel = this.runWith(state);
            const memberOrState = memberOrStateOrFunction instanceof Function ? memberOrStateOrFunction(objectLevel.second()) : memberOrStateOrFunction;
            if (memberOrState instanceof State) {
                const memberLevel = memberOrState.runWith(objectLevel.first());
                const updatedState = memberLevel.first();
                const updatedResultant = Object.assign({}, Object.assign(objectLevel.second()), { [key]: memberLevel.second() });
                return __1.pair(updatedState, updatedResultant);
            }
            else {
                const updatedState = objectLevel.first();
                const updatedResultant = Object.assign({}, Object.assign(objectLevel.second()), { [key]: memberOrState });
                return __1.pair(updatedState, updatedResultant);
            }
        });
    }
    accessState(key) {
        return this.assign(key, new State(state => __1.pair(state, state)));
    }
    replaceState(valueOrFunction) {
        return new State((state) => {
            const modifiedState = valueOrFunction instanceof Function ? valueOrFunction(state) : valueOrFunction;
            const obj = this.runWith(state).second();
            return __1.pair(modifiedState, obj);
        });
    }
    //endregion
    //region Mapping
    map(f) {
        return new State((firstState) => {
            const secondState = this.runWith(firstState);
            return secondState.mapSecond(f);
        });
    }
    //endregion
    //region Side-effects
    perform(sideEffect) {
        return new State(state => {
            const stateAndResultant = this.runWith(state);
            sideEffect(stateAndResultant.second());
            return stateAndResultant;
        });
    }
}
exports.State = State;
function state(f) {
    return new State(f);
}
exports.state = state;
function stateObject() {
    return state(state => __1.pair(state, {}));
}
exports.stateObject = stateObject;
//# sourceMappingURL=State.js.map