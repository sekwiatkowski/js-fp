import { Arrow } from '..';
export declare class Action<A> {
    private readonly f;
    constructor(f: () => A);
    andThen<B>(arrowOrFunction: Arrow<A, B> | ((input: A) => B)): Action<B>;
    act(): A;
}
export declare const action: <A>(f: () => A) => Action<A>;
