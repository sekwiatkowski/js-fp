"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Program {
    constructor(f) {
        this.f = f;
    }
    withInstructions(instructions) {
        return new Runner(() => this.f(instructions));
    }
}
exports.Program = Program;
function attempt(f, results, attemptsLeft) {
    if (attemptsLeft === 0) {
        return results;
    }
    const result = f();
    return attempt(f, results.append(result), result.isSuccess() ? 0 : --attemptsLeft);
}
class Runner {
    constructor(f) {
        this.f = f;
    }
    repeat(times) {
        return __1.repeat(times, () => this.f());
    }
    attempt(times) {
        return attempt(this.f, __1.emptyList(), times);
    }
    run() {
        return this.f();
    }
}
function program(f) {
    return new Program(f);
}
exports.program = program;
//# sourceMappingURL=Program.js.map