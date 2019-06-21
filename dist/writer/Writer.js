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
        chain(f) {
            const nextWriter = f(value);
            return writer(nextWriter.getValue(), monoid, monoid.combine(log)(nextWriter.getLog()));
        }
        get() {
            return __1.pair(value, log);
        }
        getLog() {
            return log;
        }
        getValue() {
            return value;
        }
        map(f) {
            return writer(f(value), monoid, log);
        }
        mapLog(f, newMonoid) {
            if (monoid) {
                return writer(value, newMonoid, f(log));
            }
            else {
                return writer(value, monoid, f(log));
            }
        }
        reset() {
            return this.mapLog(() => monoid.identityElement);
        }
        tell(other) {
            return this.mapLog(log => monoid.combine(log)(other));
        }
    }
    return new WriterImpl();
}
exports.writer = writer;
//# sourceMappingURL=Writer.js.map