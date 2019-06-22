import {pair, Pair} from '..'

export class State<S, A> {
    constructor(private readonly f: (state: S) => Pair<S, A>) {}

    //region Access
    get(): (state: S) => Pair<S, A> {
        return this.f
    }
    //endregion

    //region Chaining
    chain<B>(g: (current: A) => State<S, B>) {
        return new State((previousState: S) => {
            // Run the computation up until this point.
            const previousResult = this.runWith(previousState)

            // This is the end state of the computation up until now ...
            const previousEndState = previousResult.first()
            // ... and this is the resultant.
            const previousEndResultant = previousResult.second()

            // The old State instance is now discarded.
            // A new State instance is created by applying the user-supplied function to the resultant.
            const newState = g(previousEndResultant)

            // Now we have an inner State instance wrapped within the function of outer State instance.
            // To merge the two, the currentResultant is "forwarded" to the new State instance.
            return newState.runWith(previousEndState)
        })
    }
    //endregion

    //region Execution
    runWith(state: S): Pair<S, A> {
        return this.f(state)
    }

    evaluateWith(state: S): A {
        return this.runWith(state).second()
    }
    //endregion

    //region Comprehension
    assign<A extends object, K extends string, B>(
        this: State<S, A>,
        key: Exclude<K, keyof A>,
        memberOrStateOrFunction: (State<S, B> | ((scope: A) => State<S, B>)) | B | ((scope: A) => B)): State<S, A & { [key in K]: B }> {

        return this.chain(scope => {
            const memberOrState = memberOrStateOrFunction instanceof Function
                // If the user has supplied a function, apply it to the current scope to produce the member or state.
                ? memberOrStateOrFunction(scope)
                // If not, then treat the argument as a member or a state.
                : memberOrStateOrFunction

            const state = memberOrState instanceof State
                // If a user-provided state is available, use it as is.
                ? memberOrState
                // If not, then create a new State instance with the member as its resultant.
                : new State<S, B>(state => pair(state, memberOrState))

            // Map the state to merge the new member with the existing scope
            return state.map(newMember => ({...Object.assign(scope), [key]: newMember }))
        })
    }

    assignState<A extends object, K extends string>(
        this: State<S, A>,
        key: Exclude<K, keyof A>): State<S, A & { [key in K]: S }> {

        return this.chain(scope => new State(state =>
            pair(state, {...Object.assign(scope), [key]: state })
        ))
    }
    //endregion

    //region Mapping
    map<B>(f: (current: A) => B): State<S, B> {
        return new State<S, B>((firstState: S) =>
            this.runWith(firstState).mapSecond(f)
        )
    }

    mapState<T>(f: (current: S) => S): State<S, A> {
        return new State((firstState: S) =>
            this.runWith(firstState).mapFirst(f)
        )
    }
    //endregion

    //region Side-effects
    perform(sideEffect: (resultant: A) => void): State<S, A> {
        return new State(state => {
            const stateAndResultant = this.runWith(state)

            sideEffect(stateAndResultant.second())

            return stateAndResultant
        })
    }
    //endregion
}

export function state<S, A>(f: (state: S) => Pair<S, A>): State<S, A> {
    return new State(f)
}

export function stateObject<S>() {
    return state<S, object>(state => pair(state, {}))
}