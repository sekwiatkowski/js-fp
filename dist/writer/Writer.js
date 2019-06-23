"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const List_1 = require("../list/List");
const Monoid_1 = require("../combination/Monoid");
// V: value
// E: log entry (e.g., string)
// L: log (collection of log entries) (e.g., List<string> or, simply, string)
class Writer {
    constructor(value, log, entryToLog, semigroup, emptyLog) {
        this.value = value;
        this.log = log;
        this.entryToLog = entryToLog;
        this.semigroup = semigroup;
        this.emptyLog = emptyLog;
    }
    //region Access
    get() {
        return __1.pair(this.value, this.log);
    }
    getLog() {
        return this.log;
    }
    getValue() {
        return this.value;
    }
    chain(f, entry) {
        const combineWithAnotherLog = this.semigroup.combine(this.log);
        if (entry) {
            const nextValue = f(this.value);
            const otherLog = this.entryToLog(entry);
            return new Writer(nextValue, combineWithAnotherLog(otherLog), this.entryToLog, this.semigroup, this.emptyLog);
        }
        else {
            const otherWriter = f(this.value);
            const otherValue = (otherWriter).getValue();
            const otherLog = otherWriter.getLog();
            return new Writer(otherValue, combineWithAnotherLog(otherLog), this.entryToLog, this.semigroup, this.emptyLog);
        }
    }
    assign(key, memberWriterOrValueOrFunction, log) {
        return this.chain(scope => {
            const memberWriterOrValue = memberWriterOrValueOrFunction instanceof Function
                ? memberWriterOrValueOrFunction(scope)
                : memberWriterOrValueOrFunction;
            const memberWriter = memberWriterOrValue instanceof Writer
                ? memberWriterOrValue
                : new Writer(memberWriterOrValue, log ? this.entryToLog(log) : this.emptyLog, this.entryToLog, this.semigroup, this.emptyLog);
            return memberWriter.map(member => (Object.assign({}, Object(scope), { [key]: member })));
        });
    }
    //endregion
    //region Mapping
    map(f) {
        return new Writer(f(this.value), this.log, this.entryToLog, this.semigroup, this.emptyLog);
    }
    mapLog(f) {
        return new Writer(this.value, f(this.log), this.entryToLog, this.semigroup, this.emptyLog);
    }
    //endregion
    //region Modification
    reset() {
        return this.mapLog(() => this.emptyLog);
    }
    tell(other) {
        return this.mapLog(log => this.semigroup.combine(log)(other));
    }
    //endregion
    //region Side-effects
    perform(f) {
        f(this.value);
    }
    performOnLog(f) {
        f(this.log);
    }
    performOnBoth(f) {
        f(this.value, this.log);
    }
    //endregion
    //region Testing
    equals(otherWriter, equality) {
        return equality.test(this, otherWriter);
    }
    test(predicate) {
        if (predicate instanceof Function) {
            return predicate(this.value);
        }
        else {
            return predicate.test(this.value);
        }
    }
}
exports.Writer = Writer;
function writer(value, entryToLog, semigroupOrMonoid, initialLog, emptyLog) {
    if ('identityElement' in semigroupOrMonoid) {
        const monoid = semigroupOrMonoid;
        return new Writer(value, initialLog || monoid.identityElement, entryToLog, monoid, emptyLog || monoid.identityElement);
    }
    else {
        const semigroup = semigroupOrMonoid;
        const definiteInitialLog = initialLog;
        return new Writer(value, definiteInitialLog, entryToLog, semigroup, emptyLog || definiteInitialLog);
    }
}
exports.writer = writer;
function listWriter(value, initialLog = List_1.ListConcatenation.identityElement) {
    return writer(value, (single) => __1.listFromArray([single]), List_1.ListConcatenation, initialLog instanceof __1.List ? initialLog : __1.listFromArray([initialLog]));
}
exports.listWriter = listWriter;
function listWriterObject(initialLog = List_1.ListConcatenation.identityElement) {
    return listWriter({}, initialLog);
}
exports.listWriterObject = listWriterObject;
function stringWriter(value, initialLog = Monoid_1.StringConcatenation.identityElement, semigroup = Monoid_1.StringConcatenation) {
    return writer(value, __1.identity, semigroup, initialLog);
}
exports.stringWriter = stringWriter;
function createWriterEquality(valueEquality = __1.guardedStrictEquality, logEquality = __1.guardedStrictEquality) {
    return __1.neitherIsUndefinedOrNull.and(__1.equivalence((firstWriter, secondWriter) => valueEquality.test(firstWriter.getValue(), secondWriter.getValue()) &&
        logEquality.test(firstWriter.getLog(), secondWriter.getLog())));
}
exports.createWriterEquality = createWriterEquality;
//# sourceMappingURL=Writer.js.map