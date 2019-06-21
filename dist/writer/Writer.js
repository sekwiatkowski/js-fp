"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const List_1 = require("../list/List");
const Monoid_1 = require("../combination/Monoid");
class Writer {
    constructor(value, monoid, log) {
        this.value = value;
        this.monoid = monoid;
        this.log = log;
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
        return writer(nextWriter.getValue(), this.monoid, this.monoid.combine(this.log)(nextWriter.getLog()));
    }
    //endregion
    //region
    assign(key, memberOrWriterOrFunction) {
        return this.chain(obj => {
            const memberOrWriter = memberOrWriterOrFunction instanceof Function ? memberOrWriterOrFunction(obj) : memberOrWriterOrFunction;
            if (memberOrWriter instanceof Writer) {
                const expandedObject = Object.assign({}, Object(obj), { [key]: memberOrWriter.getValue() });
                return writer(expandedObject, this.monoid, memberOrWriter.getLog());
            }
            else {
                const expandedObject = Object.assign({}, Object(obj), { [key]: memberOrWriter });
                return writer(expandedObject, this.monoid, this.monoid.identityElement);
            }
        });
    }
    //endregion
    //region Mapping
    map(f) {
        return writer(f(this.value), this.monoid, this.log);
    }
    mapLog(f, newMonoid) {
        if (newMonoid) {
            return writer(this.value, newMonoid, f(this.log));
        }
        else {
            return writer(this.value, this.monoid, f(this.log));
        }
    }
    //endregion
    //region Modification
    reset() {
        return this.mapLog(() => this.monoid.identityElement);
    }
    tell(other) {
        return this.mapLog(log => this.monoid.combine(log)(other));
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
function writer(value, monoid, log = monoid.identityElement) {
    return new Writer(value, monoid, log);
}
exports.writer = writer;
function listWriter(value, log = List_1.ListConcatenation.identityElement) {
    return writer(value, List_1.ListConcatenation, log instanceof __1.List ? log : __1.listFromArray([log]));
}
exports.listWriter = listWriter;
function listWriterObject(log = List_1.ListConcatenation.identityElement) {
    return listWriter({}, log);
}
exports.listWriterObject = listWriterObject;
function stringWriter(value, log = Monoid_1.StringConcatenation.identityElement) {
    return writer(value, Monoid_1.StringConcatenation, log);
}
exports.stringWriter = stringWriter;
function createWriterEquality(valueEquality = __1.guardedStrictEquality, logEquality = __1.guardedStrictEquality) {
    return __1.neitherIsUndefinedOrNull.and(__1.equivalence((firstWriter, secondWriter) => valueEquality.test(firstWriter.getValue(), secondWriter.getValue()) &&
        logEquality.test(firstWriter.getLog(), secondWriter.getLog())));
}
exports.createWriterEquality = createWriterEquality;
//# sourceMappingURL=Writer.js.map