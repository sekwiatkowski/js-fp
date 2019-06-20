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
    return {
        //region Access
        get() {
            return __1.pair(value, log);
        },
        getValue() {
            return value;
        },
        //endregion
        getLog() {
            return log;
        },
        //endregion
        //region Chaining
        chain(f) {
            const nextWriter = f(value);
            return writer(nextWriter.getValue(), monoid, monoid.combine(log)(nextWriter.getLog()));
        },
        //endregion
        //region Mapping
        map(f) {
            return writer(f(value), monoid, log);
        },
        mapLog(f, monoid) {
            return writer(value, monoid, f(log));
        },
        mapBoth(valueMap, logMap, monoid) {
            return writer(valueMap(value), monoid, logMap(log));
        },
        //endregion
        //region Modification
        reset() {
            return this.mapLog(log => monoid.identityElement);
        },
        tell(other) {
            return this.mapLog(log => monoid.combine(log)(other));
        }
        //endregion
    };
}
exports.writer = writer;
//# sourceMappingURL=Writer.js.map