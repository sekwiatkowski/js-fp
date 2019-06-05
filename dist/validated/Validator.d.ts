import { Validated } from './Validated';
declare class Validator<T, E> {
    private readonly rules;
    constructor(rules: ((value: T) => Validated<T, E>)[]);
    validate(value: T): Validated<T, E>;
}
export declare function validator<T, E>(...rules: ((value: T) => Validated<T, E>)[]): Validator<T, E>;
export {};
