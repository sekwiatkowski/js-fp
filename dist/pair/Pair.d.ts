import { Box, Equivalence, Predicate } from '..';
export declare class Pair<A, B> {
    private readonly _first;
    private readonly _second;
    constructor(_first: A, _second: B);
    first(): A;
    second(): B;
    chain<C, D>(f: (first: A, second: B) => Pair<C, D>): Pair<C, D>;
    toArray(): [A, B];
    toBox<C>(f: (A: any, B: any) => C): Box<C>;
    bimap<M, N>(fa: (value: A) => M, fb: (value: B) => N): Pair<M, N>;
    mapFirst<M>(f: (value: A) => M): Pair<M, B>;
    mapSecond<M>(f: (value: B) => M): Pair<A, M>;
    perform(sideEffect: (first: A, second: B) => void): Pair<A, B>;
    performOnFirst(sideEffect: (first: A) => void): Pair<A, B>;
    performOnSecond(sideEffect: (second: B) => void): Pair<A, B>;
    equals(otherPair: Pair<A, B>, equality?: Equivalence<Pair<A, B>>): boolean;
    test(predicate: (value: [A, B]) => boolean): boolean;
    test(predicate: Predicate<[A, B]>): boolean;
}
export declare function pair<A, B>(first: A, second: B): Pair<A, B>;
export declare const PairEquality: Equivalence<{}>;
