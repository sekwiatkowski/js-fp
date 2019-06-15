export class Predicate<T> {
    constructor(private f: (x: T) => boolean) {}

    test(x: T): boolean {
        return this.f(x)
    }

    get(): (x: T) => boolean {
        return this.f
    }

    adapt<U>(f: (parameter: U) => T): Predicate<U> {
        return new Predicate<U>((x: U) => this.test(f(x)))
    }

    and(other: Predicate<T>): Predicate<T> {
        return new Predicate((x: T) => this.test(x) && other.test(x))
    }

    or(other: Predicate<T>): Predicate<T> {
        return new Predicate((x: T) => this.test(x) || other.test(x))
    }

    not(): Predicate<T> {
        return new Predicate((x: T) => !this.test(x))
    }
}

export const predicate = <T>(test: (x: T) => boolean) => new Predicate(test)

export const ensurePredicateFunction = <T>(predicate: ((item: T) => boolean)|Predicate<T>) =>
    predicate instanceof Function ? predicate : predicate.get()
