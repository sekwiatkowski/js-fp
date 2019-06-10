import { List } from './List';
export declare function repeat<T>(times: number, valueOrFunction: T | ((index?: number) => T)): List<T>;
