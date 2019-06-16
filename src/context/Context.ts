import {ensurePredicateFunction, Equivalence, guardedStrictEquality, Predicate} from '..'

export class Context<C, T> {
    constructor(private f: (shared: C) => T) {}

    //region Access
    get(): (C) => T {
        return this.f
    }
    //endregion

    //region Chaining
    chain<U>(g: (value: T) => Context<C, U>): Context<C, U> {
        return new Context<C, U>(shared => {
            const first = this.f(shared)

            return g(first).runWith(shared)
        })
    }
    //endregion

    //region Comprehension
    assign<U extends object, K extends string, V>(
        this: Context<C, U>,
        key: K,
        memberOrContextOrFunction: Context<C, V>|((scope: U) => Context<C, V>) | V | ((scope: U) => V)) : Context<C, U & { [key in K]: V }> {

        return new Context(shared => {
            const scope = this.f(shared)

            const memberOrContext = memberOrContextOrFunction instanceof Function ? memberOrContextOrFunction(scope) : memberOrContextOrFunction
            const member = memberOrContext instanceof Context ? memberOrContext.runWith(shared) : memberOrContext
            return {
                ...Object(scope),
                [key]: member
            }
        })
    }

    assignWithContext<U extends object, K extends string, V>(
        this: Context<C, U>,
        key: K,
        memberOrContextOrFunction: ((shared: C, scope?: U) => Context<C, V>) | ((shared: C, scope?: U) => V)) : Context<C, U & { [key in K]: V }> {

        return new Context(shared => {
            const scope = this.f(shared)

            const memberOrContext = memberOrContextOrFunction instanceof Function ? memberOrContextOrFunction(shared, scope) : memberOrContextOrFunction
            const member = memberOrContext instanceof Context ? memberOrContext.runWith(shared) : memberOrContext
            return {
                ...Object(scope),
                [key]: member
            }
        })
    }

    //endregion

    //region Execution
    runWith(shared: C): T {
        return this.f(shared)
    }
    //endregion

    //region Mapping
    map<U>(g: (input: T) => U): Context<C, U> {
        return new Context<C, U>((shared: C) => g(this.f(shared)))
    }
    //endregion Mapping

    //region Side-effects
    perform(sideEffect: (value: T) => void): Context<C, T> {
        return new Context(shared => {
            const scope = this.f(shared)

            sideEffect(scope)

            return scope
        })
    }

    performWithContext(sideEffect: (shared: C, value: T) => void): Context<C, T> {
        return new Context(shared => {
            const scope = this.f(shared)

            sideEffect(shared, scope)

            return scope
        })
    }

    //endregion

    //region Testing
    equals(other: T, equality?: Equivalence<T>): ContextualTest<C> {
        return new ContextualTest(shared => {
            return (equality || guardedStrictEquality).test(this.f(shared), other)
        })
    }

    test(predicate: (value: T) => boolean): ContextualTest<C>
    test(predicate: Predicate<T>): ContextualTest<C>
    test(predicate: ((value: T) => boolean)|Predicate<T>): ContextualTest<C> {
        return new ContextualTest(shared => {
            const predicateFunction = ensurePredicateFunction(predicate)

            return predicateFunction(this.f(shared))
        })
    }
    //endregion
}

export const context = <C, T>(f: (shared: C) => T) => new Context(f)

export const contextualObject = <E>() => context<E, {}>(() => ({}))

class ContextualTest<C> {
    constructor(private f: (shared: C) => boolean) {}

    runWith(shared: C): boolean {
        return this.f(shared)
    }
}