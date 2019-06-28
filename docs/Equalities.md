# Equalities for Basic Types

## String

[**StringEquality**](../src/equivalence/Equality.ts): neither string is undefined or null and both strings have the same value  

[**NullableStringEquality**](../src/equivalence/Equality.ts): like StringEquality, but returns *true* when both strings are null

[**StringArrayEquality**](../src/equivalence/ArrayEquality.ts): neither array is undefined or null, both arrays have the same length and each pair of corresponding items satisfies StringEquality

[**NullableStringArrayEquality**](../src/equivalence/ArrayEquality.ts): like StringArrayEquality, but returns true when both arrays are null corresponding items have to satisfy NullableStringEquality 

## Number

[**NumberEquality**](../src/equivalence/Equality.ts): neither number is undefined or null and both numbers have the same value  

[**NullableNumberEquality**](../src/equivalence/Equality.ts): like NumberEquality, but returns *true* when both numbers are null

[**NumberArrayEquality**](../src/equivalence/ArrayEquality.ts): neither array is undefined or null, both arrays have the same length and each pair of corresponding items satisfies NumberEquality

[**NullableNumberArrayEquality**](../src/equivalence/ArrayEquality.ts): like NumberArrayEquality, but returns true when both arrays are null corresponding items have to satisfy NullableNumberEquality

## Boolean

[**BooleanEquality**](../src/equivalence/Equality.ts): neither boolean is undefined or null and both booleans have the same value

[**NullableBooleanEquality**](../src/equivalence/Equality.ts): like BooleanEquality, but returns *true* when both booleans are null

[**BooleanArrayEquality**](../src/equivalence/ArrayEquality.ts): neither array is undefined or null, both arrays have the same length and each pair of corresponding items satisfies BooleanEquality

[**NullableBooleanArrayEquality**](../src/equivalence/ArrayEquality.ts): like BooleanArrayEquality, but returns true when both arrays are null corresponding items have to satisfy NullableBooleanEquality

## Date

[**DateEquality**](../src/equivalence/Equality.ts): neither Date instance is undefined or null and both dates have the same value

[**NullableDateEquality**](../src/equivalence/Equality.ts): like DateEquality, but returns *true* when both instances are null

[**DateArrayEquality**](../src/equivalence/ArrayEquality.ts): neither array is undefined or null, both arrays have the same length and each pair of corresponding items satisfies DateEquality

[**NullableDateArrayEquality**](../src/equivalence/ArrayEquality.ts): like DateArrayEquality, but returns true when both arrays are null corresponding items have to satisfy NullableDateEquality
