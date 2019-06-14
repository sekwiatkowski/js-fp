import { Equivalence } from './Equivalence';
export declare const objectEquivalence: <T extends {
    [key: string]: any;
}>(equivalences: { [K in keyof T]?: Partial<Equivalence<T[K]>>; }) => Equivalence<T>;
