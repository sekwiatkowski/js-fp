import { Future } from '..';
export declare class List<T> {
    private readonly array;
    constructor(array: T[]);
    map<U>(f: (value: T) => U): List<U>;
    parallelMap<U, E>(f: (value: T) => U): Future<U[], E>;
    sort(): List<T>;
    sortBy<U>(f: (value: T) => U): List<T>;
    sortDescendingly(): List<T>;
    sortDescendinglyBy<U>(f: (value: T) => U): List<T>;
    size(): number;
    isEmpty(): boolean;
    isNotEmpty(): boolean;
    toArray(): T[];
    concat(otherList: List<T>): List<any>;
    all(predicate: (item: T) => boolean): boolean;
    some(predicate: (item: T) => boolean): boolean;
    none(predicate: (item: T) => boolean): boolean;
}
export declare function list<T>(...array: T[]): List<T>;
