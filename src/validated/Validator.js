"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validator {
    constructor(rules) {
        this.rules = rules;
    }
    validate(value) {
        return this.rules
            .map(rule => rule(value))
            .reduce((acc, current) => acc.concat(current));
    }
}
function validator(...rules) {
    return new Validator(rules);
}
exports.validator = validator;
