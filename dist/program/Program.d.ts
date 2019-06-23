import { List, NonEmptyList, Result } from '..';
export declare class Program<I, T, E> {
    private readonly f;
    constructor(f: (instructions: I) => Result<T, E>);
    withInstructions(instructions: I): Runner<T, E>;
}
declare class Runner<T, E> {
    private readonly f;
    constructor(f: () => Result<T, E>);
    repeat(times: number): List<Result<T, E>>;
    attempt(times: number): NonEmptyList<Result<T, E>>;
    run(): Result<T, E>;
}
export declare function program<I, T, E>(f: (instructions: I) => Result<T, E>): Program<I, T, E>;
export {};
