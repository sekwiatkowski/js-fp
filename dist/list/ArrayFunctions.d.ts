import { Future, List, Option } from '..';
import { NonEmptyList } from './NonEmptyList';
export declare function getItem<T>(items: T[], index: number): Option<T>;
export declare function getItemOrElse<T>(items: T[], index: number, alternative: T | (() => T)): T;
export declare function takeItems<T>(items: T[], n: number): T[];
export declare function flatten<U>(items: (NonEmptyList<U> | List<U> | U[])[]): U[];
export declare function appendItem<T>(items: T[], item: T): T[];
export declare function prependItem<T>(items: T[], item: T): T[];
export declare function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[];
export declare function reduceItemsBy<T, U>(items: T[], by: (item: T) => U, operation: (a: U) => (b: U) => U): U;
export declare function foldItemsBy<T, U>(items: T[], by: (item: T) => U, operation: (a: U) => (b: U) => U, initialValue: U): U;
export declare function groupItemsBy<T>(items: T[], computeKey: (item: T) => string): {
    [id: string]: T[];
};
export declare function mapItems<T, U>(items: T[], f: (T: any) => U): U[];
export declare function parallelMapItems<T, U, E>(items: T[], f: (item: T) => U): Future<U[], E>;
export declare function rangeOfItems(start: number, end?: number): number[];
export declare function repeatItems<T>(times: number, valueOrFunction: T | ((index?: number) => T)): T[];
export declare function findItem<T>(items: T[], predicate: (item: T) => boolean): Option<T>;
export declare function findLastItem<T>(items: T[], predicate: (item: T) => boolean): Option<T>;
export declare function forEachItem<T>(items: T[], sideEffect: (item: T) => void): void;
export declare function sortItems<T>(items: T[]): T[];
export declare function sortItemsBy<T, U>(items: T[], by: (item: T) => U): T[];
export declare function sortItemsDescendingly<T>(items: T[]): T[];
export declare function sortItemsDescendinglyBy<T, U>(items: T[], by: (item: T) => U): T[];
export declare function containsItem<T>(items: T[], item: T): boolean;
export declare function equalItems<T>(thisArray: T[], thatArray: T[]): boolean;
export declare function allItems<T>(items: T[], predicate: (item: T) => boolean): boolean;
export declare function someItem<T>(items: T[], predicate: (item: T) => boolean): boolean;
export declare function noItems<T>(items: T[], predicate: (item: T) => boolean): boolean;
export declare function countItems<T>(items: T[], predicate: (item: T) => boolean): number;
