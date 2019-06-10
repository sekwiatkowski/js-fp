# FlowScript

## A TypeScript/JavaScript library designed to implement workflows as computational graphs

[**Box**](src/box/Box.ts): guaranteed computation with exactly one value

[**List**](src/list/List.ts): computation with many values

[**Option**](src/option/Option.ts): computation with a value that may be present or absent

[**Result**](src/result/Result.ts): synchronous computation that may succeed or fail, short-circuits when a failure occurs

[**Validated**](src/validated/Validated.ts): like *Result*, but accumulates errors instead of short-circuiting

[**Future**](src/future/Future.ts): asynchronous computation that may succeed or fail (a monadic alternative to Promises)