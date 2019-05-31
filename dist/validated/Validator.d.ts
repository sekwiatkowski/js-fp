import {Validated} from './Validated';

declare class Validator<T> {
    private readonly rules;
    constructor(rules: ((T: any) => Validated<T>)[]);
    validate(value: T): Validated<T>;
}
export declare function validator<T>(...rules: ((T: any) => Validated<T>)[]): Validator<T>;
export {};
