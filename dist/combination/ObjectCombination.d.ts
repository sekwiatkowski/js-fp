import { Semigroup } from './Semigroup';
export declare const objectCombination: <T extends {
    [key: string]: any;
}>(semigroups: { [K in keyof T]: Semigroup<T[K]>; }) => Semigroup<T>;
