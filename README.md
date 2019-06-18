# FlowScript

A TypeScript/JavaScript library designed to implement workflows as computational graphs

## Computation with monad(-like) containers

[**Box**](src/box/Box.ts): guaranteed computation with exactly one value

[**List**](src/list/List.ts): computation with zero, one or more values

[**NonEmptyList**](src/list/NonEmptyList.ts): computation with one or more values

[**Option**](src/option/Option.ts): computation with a value that may be present or absent

[**Program**](src/arrow/Arrow.ts): computation with a shared environment (used for dependency injection)

[**Result**](src/result/Result.ts): synchronous computation that may succeed or fail, short-circuits when a failure occurs

[**Validated**](src/validated/Validated.ts): like *Result*, but accumulates errors instead of short-circuiting

[**Future**](src/future/Future.ts): asynchronous computation that may succeed or fail (a monadic alternative to Promises)

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

#### Array

[**ArrayConcatenation**](src/combination/Monoid.ts): combines two arrays using concatenation

## Testing

### Equivalence with setoids

[**Equivalence**](src/equivalence/Equivalence.ts): testing of equivalence between two values of the same type

[**objectEquivalence**](src/combination/ObjectEquivalence.ts): a function to create equivalence schemes for objects based on member equivalences

#### String

[**StringEquality**](src/equivalence/Equality.ts): neither string is undefined or null and both strings have the same value  

[**NullableStringEquality**](src/equivalence/Equality.ts): like StringEquality, but returns *true* when both strings are null

[**StringArrayEquality**](src/equivalence/ArrayEquality.ts): neither array is undefined or null, both arrays have the same length and each pair of corresponding items satisfies StringEquality

[**NullableStringArrayEquality**](src/equivalence/ArrayEquality.ts): like StringArrayEquality, but returns true when both arrays are null corresponding items have to satisfy NullableStringEquality 

#### Number

[**NumberEquality**](src/equivalence/Equality.ts): neither number is undefined or null and both numbers have the same value  

[**NullableNumberEquality**](src/equivalence/Equality.ts): like NumberEquality, but returns *true* when both numbers are null

[**NumberArrayEquality**](src/equivalence/ArrayEquality.ts): neither array is undefined or null, both arrays have the same length and each pair of corresponding items satisfies NumberEquality

[**NullableNumberArrayEquality**](src/equivalence/ArrayEquality.ts): like NumberArrayEquality, but returns true when both arrays are null corresponding items have to satisfy NullableNumberEquality

#### Boolean

[**BooleanEquality**](src/equivalence/Equality.ts): neither boolean is undefined or null and both booleans have the same value

[**NullableBooleanEquality**](src/equivalence/Equality.ts): like BooleanEquality, but returns *true* when both booleans are null

[**BooleanArrayEquality**](src/equivalence/ArrayEquality.ts): neither array is undefined or null, both arrays have the same length and each pair of corresponding items satisfies BooleanEquality

[**NullableBooleanArrayEquality**](src/equivalence/ArrayEquality.ts): like BooleanArrayEquality, but returns true when both arrays are null corresponding items have to satisfy NullableBooleanEquality

#### Date

[**DateEquality**](src/equivalence/Equality.ts): neither Date instance is undefined or null and both dates have the same value

[**NullableDateEquality**](src/equivalence/Equality.ts): like DateEquality, but returns *true* when both instances are null

[**DateArrayEquality**](src/equivalence/ArrayEquality.ts): neither array is undefined or null, both arrays have the same length and each pair of corresponding items satisfies DateEquality

[**NullableDateArrayEquality**](src/equivalence/ArrayEquality.ts): like DateArrayEquality, but returns true when both arrays are null corresponding items have to satisfy NullableDateEquality

### Order

[**Order**](src/order/Order.ts): decision on the order of two values 

[**Ordering**](src/order/Order.ts): a type alias for the three possible outcomes (-1, 0 and 1)

### Predicate

[**Predicate**](src/predicate/Predicate.ts): wrapper around predicate functions