export class Equivalence<T> {
    constructor(private f: (x: T, y: T) => boolean) {}

    test(x: T, y: T): boolean {
        return this.f(x, y)
    }

    get(): (x: T, y: T) => boolean {
        return this.f
    }

    adapt<U>(f: (parameter: U) => T): Equivalence<U> {
        return new Equivalence<U>((x: U, y: U) => this.test(f(x), f(y)))
    }

    and(other: Equivalence<T>): Equivalence<T> {
        return new Equivalence((x: T, y: T) => this.test(x, y) && other.test(x, y))
    }

    or(other: Equivalence<T>): Equivalence<T> {
        return new Equivalence((x: T, y: T) => this.test(x, y) || other.test(x, y))
    }

    not(): Equivalence<T> {
        return new Equivalence((x: T, y: T) => !this.test(x, y))
    }
}

export const equivalence = <T>(test: (x: T, y: T) => boolean) => new Equivalence(test)
