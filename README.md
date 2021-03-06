# JS/FP

A pragmatic functional programming library for JavaScript/TypeScript

## Computation with monad(-like) objects

### Computation with one or two values

[**Box**](src/box/Box.ts): computation with one value

[**Pair**](src/box/Box.ts): computation with two values

### Computation with *n* values

[**List**](src/list/List.ts): computation with zero, one or more values

[**NonEmptyList**](src/list/NonEmptyList.ts): computation with one or more values

### Computation with error handling

[**Option**](src/option/Option.ts): computation with a value that may be present or absent

[**Result**](src/result/Result.ts): synchronous computation that may succeed or fail, short-circuits when a failure occurs

[**Validated**](src/validated/Validated.ts): like *Result*, but accumulates errors instead of short-circuiting

### Computation with a value and a context

[**State**](src/state/State.ts): stateful computation

[**Writer**](src/writer/Writer.ts): computation with additional data (used for logging)

#### Writers

[**StringWriter**](src/writer/Writer.ts): computation with log entries concatenated to a string

[**ListWriter**](src/writer/Writer.ts): computation with log entries concatenated to a [**List**](src/list/List.ts) instance 

### Asynchronous computation

[**Future**](src/future/Future.ts): asynchronous computation that may succeed or fail (a monadic alternative to Promises)

### High-level computation

[**Program**](src/program/Program.ts): interpretation of program descriptions 

## Functions

[**Action**](src/action/Action.ts): wrapper around a function with no parameters that enables composition

[**Arrow**](src/arrow/Arrow.ts): wrapper around a function with one or more parameters that enables composition and adaptation of the input

## Combination

### Combination with semigroups

[**Semigroup**](src/combination/Semigroup.ts): a type that supports an associative binary operation

[**objectCombination**](src/combination/ObjectCombination.ts): a function to create combination schemes for objects based on semigroups

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

#### String

[**StringConcatenation**](src/combination/Monoid.ts): combines two string using concatenation

#### Array

[**ArrayConcatenation**](src/combination/Monoid.ts): combines two arrays using concatenation

#### List

[**ListConcatenation**](src/combination/Monoid.ts): combines two lists using concatenation

## Testing

### Equivalence

[**Equivalence**](src/equivalence/Equivalence.ts): testing of equivalence between two values of the same type

[**objectEquivalence**](src/combination/ObjectEquivalence.ts): a function to create equivalence schemes for objects based on member equivalences

[**Equalities for basic types**](docs/Equalities.md): equalities for string, number, boolean and Date values and arrays of such values

### Order

[**Order**](src/order/Order.ts): decision on the order of two values 

[**Ordering**](src/order/Order.ts): a type alias for the three possible outcomes (-1, 0 and 1)

### Predicate

[**Predicate**](src/predicate/Predicate.ts): wrapper around predicate functions