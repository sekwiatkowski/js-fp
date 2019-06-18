export declare class Program<E, T> {
    private f;
    constructor(f: (shared: E) => T);
    run(shared: E): T;
}
export declare function program<E = void, T = void>(f: (environment: E) => T): Program<E, T>;
