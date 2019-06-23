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
        return new State((previousState) => {
            // Run the computation up until this point.
            const previousResult = this.runWith(previousState);
            // This is the end state of the computation up until now ...
            const previousEndState = previousResult.first();
            // ... and this is the resultant.
            const previousEndResultant = previousResult.second();
            // The old State instance is now discarded.
            // A new State instance is created by applying the user-supplied function to the resultant.
            const newState = g(previousEndResultant);
            // Now we have an inner State instance wrapped within the function of outer State instance.
            // To merge the two, the currentResultant is "forwarded" to the new State instance.
            return newState.runWith(previousEndState);
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
        return this.chain(scope => {
            const memberOrState = memberOrStateOrFunction instanceof Function
                // If the user has supplied a function, apply it to the current scope to produce the member or state.
                ? memberOrStateOrFunction(scope)
                // If not, then treat the argument as a member or a state.
                : memberOrStateOrFunction;
            const state = memberOrState instanceof State
                // If a user-provided state is available, use it as is.
                ? memberOrState
                // If not, then create a new State instance with the member as its resultant.
                : new State(state => __1.pair(state, memberOrState));
            // Map the state to merge the new member with the existing scope
            return state.map(newMember => (Object.assign({}, Object.assign(scope), { [key]: newMember })));
        });
    }
    assignState(key) {
        return this.chain(scope => new State(state => __1.pair(state, Object.assign({}, Object.assign(scope), { [key]: state }))));
    }
    //endregion
    //region Mapping
    map(f) {
        return new State((firstState) => this.runWith(firstState).mapSecond(f));
    }
    mapState(f) {
        return new State((firstState) => this.runWith(firstState).mapFirst(f));
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