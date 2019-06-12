# FlowScript

## A TypeScript/JavaScript library designed to implement workflows as computational graphs

### Computation with monad(-like) containers

[**Box**](src/box/Box.ts): guaranteed computation with exactly one value

[**List**](src/list/List.ts): computation with zero, one or more values

[**NonEmptyList**](src/list/NonEmptyList.ts): computation with one or more values

[**Option**](src/option/Option.ts): computation with a value that may be present or absent

[**Result**](src/result/Result.ts): synchronous computation that may succeed or fail, short-circuits when a failure occurs

[**Validated**](src/validated/Validated.ts): like *Result*, but accumulates errors instead of short-circuiting

[**Future**](src/future/Future.ts): asynchronous computation that may succeed or fail (a monadic alternative to Promises)

### Combination with semigroups

[**Semigroup**](src/combination/Semigroup.ts): a type that supports an associative binary operation

[**objectCombination**](src/combination/ObjectCombination.ts): a function to create a combination scheme for objects based on semigroups

### Combination with monoids

[**Monoid**](src/combination/Monoid.ts): a semigroup with an identity element

#### Boolean

[**All**](src/combination/Monoid.ts): combines two booleans using logical AND

[**Any**](src/combination/Monoid.ts): combines two booleans using logical OR

#### Number

[**Min**](src/combination/Monoid.ts): combines two numbers, resulting in the smallest of the two

[**Max**](src/combination/Monoid.ts): combines two numbers, resulting in the largest of the two

[**Sum**](src/combination/Monoid.ts): combines two numbers, resulting in the sum of the two

[**Product**](src/combination/Monoid.ts): combines two numbers, resulting in the product of the two

#### Date

[**Earliest**](src/combination/Monoid.ts): combines two dates, resulting in the earlier of the two

[**Latest**](src/combination/Monoid.ts): combines two dates, resulting in the later of the two

#### Array

[**ArrayConcatenation**](src/combination/Monoid.ts): combines two arrays using concatenation