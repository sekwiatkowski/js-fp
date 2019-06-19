export declare class Program<E, T> {
    private readonly f;
    constructor(f: (shared: E) => T);
    runWith(shared: E): T;
}
export declare function program<E = void, T = void>(f: (environment: E) => T): Program<E, T>;
