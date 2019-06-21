"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const List_1 = require("../list/List");
const Monoid_1 = require("../combination/Monoid");
function listWriter(value, log = List_1.ListConcatenation.identityElement) {
    return writer(value, List_1.ListConcatenation, log instanceof __1.List ? log : __1.listFromArray([log]));
}
exports.listWriter = listWriter;
function stringWriter(value, log = Monoid_1.StringConcatenation.identityElement) {
    return writer(value, Monoid_1.StringConcatenation, log);
}
exports.stringWriter = stringWriter;
function writer(value, monoid, log = monoid.identityElement) {
    class WriterImpl {
        //region Access
        get() {
            return __1.pair(value, log);
        }
        getLog() {
            return log;
        }
        getValue() {
            return value;
        }
        //endregion
        //region Chaining
        chain(f) {
            const nextWriter = f(value);
            return writer(nextWriter.getValue(), monoid, monoid.combine(log)(nextWriter.getLog()));
        }
        //endregion
        //region Mapping
        map(f) {
            return writer(f(value), monoid, log);
        }
        mapLog(f, newMonoid) {
            if (newMonoid) {
                return writer(value, newMonoid, f(log));
            }
            else {
                return writer(value, monoid, f(log));
            }
        }
        //endregion
        //region Modification
        reset() {
            return this.mapLog(() => monoid.identityElement);
        }
        tell(other) {
            return this.mapLog(log => monoid.combine(log)(other));
        }
        //endregion
        //region Side-effects
        perform(f) {
            f(value);
        }
        performOnLog(f) {
            f(log);
        }
        performOnBoth(f) {
            f(value, log);
        }
        //endregion
        //region Testing
        equals(otherWriter, equality) {
            return equality.test(this, otherWriter);
        }
        test(predicate) {
            if (predicate instanceof Function) {
                return predicate(value);
            }
            else {
                return predicate.test(value);
            }
        }
    }
    return new WriterImpl();
}
exports.writer = writer;
function createWriterEquality(valueEquality = __1.guardedStrictEquality, logEquality = __1.guardedStrictEquality) {
    return __1.neitherIsUndefinedOrNull.and(__1.equivalence((firstWriter, secondWriter) => valueEquality.test(firstWriter.getValue(), secondWriter.getValue()) &&
        logEquality.test(firstWriter.getLog(), secondWriter.getLog())));
}
exports.createWriterEquality = createWriterEquality;
//# sourceMappingURL=Writer.js.map