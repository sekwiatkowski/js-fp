"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const List_1 = require("../list/List");
const Monoid_1 = require("../combination/Monoid");
class Writer {
    constructor(value, log, semigroup, _resetLog) {
        this.value = value;
        this.log = log;
        this.semigroup = semigroup;
        this._resetLog = _resetLog;
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
    //endregion
    //region Chaining
    chain(f) {
        const nextWriter = f(this.value);
        return new Writer(nextWriter.getValue(), this.semigroup.combine(this.log)(nextWriter.getLog()), this.semigroup, this._resetLog);
    }
    //endregion
    //region
    assign(key, memberOrWriterOrFunction) {
        return this.chain(obj => {
            const memberOrWriter = memberOrWriterOrFunction instanceof Function ? memberOrWriterOrFunction(obj) : memberOrWriterOrFunction;
            if (memberOrWriter instanceof Writer) {
                const expandedObject = Object.assign({}, Object(obj), { [key]: memberOrWriter.getValue() });
                return new Writer(expandedObject, memberOrWriter.getLog(), this.semigroup, this._resetLog);
            }
            else {
                const expandedObject = Object.assign({}, Object(obj), { [key]: memberOrWriter });
                return new Writer(expandedObject, this.getLog(), this.semigroup, this._resetLog);
            }
        });
    }
    //endregion
    //region Mapping
    map(f) {
        return new Writer(f(this.value), this.log, this.semigroup, this._resetLog);
    }
    mapLog(f, monoidOrSemigroup, resetLog) {
        if (monoidOrSemigroup) {
            const mapToM = f;
            const logInM = mapToM(this.log);
            if (resetLog) {
                return new Writer(this.value, logInM, monoidOrSemigroup, resetLog);
            }
            else {
                const monoid = monoidOrSemigroup;
                return new Writer(this.value, logInM, monoid, () => monoid.identityElement);
            }
        }
        else {
            const mapWitinL = f;
            return new Writer(this.value, mapWitinL(this.log), this.semigroup, this._resetLog);
        }
    }
    //endregion
    //region Modification
    reset() {
        return this.mapLog(this._resetLog);
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
function writer(value, semigroupOrMonoid, initialLog) {
    if (initialLog) {
        return new Writer(value, initialLog, semigroupOrMonoid, () => initialLog);
    }
    else {
        const monoid = semigroupOrMonoid;
        return new Writer(value, monoid.identityElement, monoid, () => monoid.identityElement);
    }
}
exports.writer = writer;
function listWriter(value, initialLog = List_1.ListConcatenation.identityElement) {
    return writer(value, List_1.ListConcatenation, initialLog instanceof __1.List ? initialLog : __1.listFromArray([initialLog]));
}
exports.listWriter = listWriter;
function listWriterObject(initialLog = List_1.ListConcatenation.identityElement) {
    return listWriter({}, initialLog);
}
exports.listWriterObject = listWriterObject;
function stringWriter(value, initialLog = Monoid_1.StringConcatenation.identityElement) {
    return writer(value, Monoid_1.StringConcatenation, initialLog);
}
exports.stringWriter = stringWriter;
function createWriterEquality(valueEquality = __1.guardedStrictEquality, logEquality = __1.guardedStrictEquality) {
    return __1.neitherIsUndefinedOrNull.and(__1.equivalence((firstWriter, secondWriter) => valueEquality.test(firstWriter.getValue(), secondWriter.getValue()) &&
        logEquality.test(firstWriter.getLog(), secondWriter.getLog())));
}
exports.createWriterEquality = createWriterEquality;
//# sourceMappingURL=Writer.js.map