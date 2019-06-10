"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("./List");
function repeat(times, valueOrFunction) {
    const array = new Array(times);
    if (valueOrFunction instanceof Function) {
        for (let index = 0; index < times; index++) {
            array[index] = valueOrFunction(index);
        }
    }
    else {
        for (let index = 0; index < times; index++) {
            array[index] = valueOrFunction;
        }
    }
    return new List_1.List(array);
}
exports.repeat = repeat;
//# sourceMappingURL=Repetition.js.map