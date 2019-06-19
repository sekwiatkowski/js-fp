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
        return new State((firstState: S) => {
            const secondState = this.f(firstState)
            return g(secondState.second()).runWith(secondState.first())
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
    assign<S, A extends object, B, K extends string>(
        this: State<S, A>,
        key: K,
        memberOrStateOrFunction: (State<S, B> | ((scope: A) => State<S, B>)) | B | ((scope: A) => B)): State<S, A & { [key in K]: B }> {

        return new State(state => {
            const objectLevel = this.runWith(state)

            const memberOrState = memberOrStateOrFunction instanceof Function ? memberOrStateOrFunction(objectLevel.second()) : memberOrStateOrFunction

            if (memberOrState instanceof State) {
                const memberLevel = memberOrState.runWith(objectLevel.first())

                const updatedState = memberLevel.first()
                const updatedResultant = {...Object.assign(objectLevel.second()), [key]: memberLevel.second()}

                return pair(updatedState, updatedResultant)
            }
            else {
                const updatedState = objectLevel.first()
                const updatedResultant = {...Object.assign(objectLevel.second()), [key]: memberOrState}

                return pair(updatedState, updatedResultant)
            }
        })
    }
    //endregion

    //region Mapping
    map<B>(f: (current: A) => B): State<S, B> {
        return new State<S, B>((firstState: S) => {
            const secondState = this.runWith(firstState)

            return secondState.mapSecond(f)
        })
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