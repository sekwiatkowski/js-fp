import { Future, List, Option, Semigroup } from '..';
import { Monoid } from '../combination/Monoid';
export declare class NonEmptyList<T> {
    private readonly items;
    private readonly length;
    constructor(items: T[]);
    first(): T;
    get(index: number): Option<T>;
    getArray(): T[];
    getOrElse(index: number, alternative: T | (() => T)): T;
    last(): T;
    take(n: number): NonEmptyList<T>;
    flatten<U>(this: NonEmptyList<NonEmptyList<U> | U[]>): NonEmptyList<U>;
    chain(f: (T: any) => NonEmptyList<T>): NonEmptyList<T>;
    concat(otherList: NonEmptyList<T>): NonEmptyList<T>;
    append(item: T): NonEmptyList<T>;
    prepend(item: T): NonEmptyList<T>;
    filter(predicate: (item: T) => boolean): List<T>;
    reduceBy<U>(by: (item: T) => U, operation: (a: U) => (b: U) => U): Option<U>;
    reduce(operation: (a: T) => (b: T) => T): Option<T>;
    reduceByWithSemigroup<U>(by: (item: T) => U, semigroup: Semigroup<U>): Option<U>;
    reduceWithSemigroup(semigroup: Semigroup<T>): Option<T>;
    foldBy<U>(by: (item: T) => U, operation: (a: U) => (b: U) => U, initialValue: U): U;
    fold(operation: (a: T) => (b: T) => T, initialValue: T): T;
    foldWithMonoid(monoid: Monoid<T>): T;
    foldByWithMonoid<U>(by: (item: T) => U, monoid: Monoid<U>): U;
    max(this: NonEmptyList<number>): number;
    earliest(this: List<Date>): Option<Date>;
    earliestBy<U>(this: List<T>, by: (item: T) => Date): Option<Date>;
    latest(this: List<Date>): Option<Date>;
    latestBy<U>(this: List<T>, by: (item: T) => Date): Option<Date>;
    maxBy(by: (item: T) => number): number;
    min(this: NonEmptyList<number>): number;
    minBy(by: (item: T) => number): number;
    sum(this: NonEmptyList<number>): number;
    sumBy(by: (item: T) => number): number;
    product(this: NonEmptyList<number>): number;
    productBy(by: (item: T) => number): number;
    groupBy(computeKey: (item: T) => string): {
        [id: string]: T[];
    };
    map<U>(f: (item: T) => U): NonEmptyList<U>;
    parallelMap<U, E>(f: (item: T) => U): Future<U[], E>;
    find(predicate: (item: T) => boolean): Option<T>;
    findLast(predicate?: (item: T) => boolean): Option<T>;
    perform(sideEffect: (list: NonEmptyList<T>) => void): void;
    forEach(sideEffect: (item: T) => void): void;
    size(): number;
    sort(): NonEmptyList<T>;
    sortBy<U>(by: (item: T) => U): NonEmptyList<T>;
    sortDescendingly(): NonEmptyList<T>;
    sortDescendinglyBy<U>(by: (item: T) => U): NonEmptyList<T>;
    contains(item: T): boolean;
    equals(otherList: NonEmptyList<T>): boolean;
    all(predicate: (item: T) => boolean): boolean;
    some(predicate: (item: T) => boolean): boolean;
    none(predicate: (item: T) => boolean): boolean;
    count(predicate: (item: T) => boolean): number;
}
export declare function nonEmptyList<T>(head: T, ...tail: T[]): NonEmptyList<T>;
export declare function inclusiveRange(start: number, end?: number): NonEmptyList<number>;
