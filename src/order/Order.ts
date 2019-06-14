export type Ordering = -1|0|1

export class Order<T> {
    constructor (private f: (x: T, y: T) => Ordering) {}

    get() {
        return this.f
    }

    compare(x: T, y: T) {
        return this.f(x, y)
    }

    mapParameter<U>(f: (value: U) => T): Order<U> {
        return new Order<U>((x: U, y: U) => this.compare(f(x), f(y)))
    }

    invert(): Order<T> {
        return new Order((x: T, y: T) => this.compare(y, x))
    }

    min(): (x: T, y: T) => T {
        return (x: T, y: T) => this.compare(x, y) === 1 ? x : y
    }

    max(): (x: T, y: T) => T {
        return (x: T, y: T) => this.compare(x, y) === -1 ? x : y
    }

    concat(otherOrFunction: ((x: T, y: T) => Ordering)|Order<T>): Order<T> {
        const other = otherOrFunction instanceof Function ? order(otherOrFunction) : otherOrFunction

        return new Order<T>((x, y) => {
            const firstComparison = this.compare(x, y)

            if (firstComparison == 0) {
                return other.compare(x, y)
            }
            else {
                return firstComparison
            }
        })
    }

    thenBy<U extends { [key in any]: any }, V>(this: Order<U>, by: (obj: U) => V, byOrder?: Order<U>) {
        return this.concat(orderBy(by, byOrder))
    }

    thenDescendinglyBy<U extends { [key in any]: any }, V>(this: Order<U>, by: (obj: U) => V, byOrder?: Order<U>) {
        return this.concat(orderBy(by, byOrder).invert())
    }
}

export const order = <T>(f: (x: T, y: T) => Ordering) => new Order(f)

export const AnyOrder = order((x: any, y: any) => x < y ? -1 : x > y ? 1 : 0)
export const DescendingAnyOrder = AnyOrder.invert()

export function orderBy <T, U>(by: (x: T) => U, byOrder?: Order<U>): Order<T> {
    return order((x: T, y: T) => (byOrder || AnyOrder).compare(by(x), by(y)))
}

export function orderDescendinglyBy <T, U>(by: (x: T) => U, byOrder?: Order<U>): Order<T> {
    return orderBy(by, byOrder).invert()
}

export const NumberOrder: Order<number> = AnyOrder
export const StringOrder: Order<string> = AnyOrder
export const BooleanOrder: Order<boolean> = AnyOrder
export const DateOrder = AnyOrder.mapParameter(date => date.valueOf())

export const DescendingNumberOrder: Order<number> = DescendingAnyOrder
export const DescendingStringOrder: Order<string> = DescendingAnyOrder
export const DescendingBooleanOrder: Order<boolean> = DescendingAnyOrder
export const DescendingDateOrder = DateOrder.invert()