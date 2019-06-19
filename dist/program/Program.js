"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Program {
    constructor(f) {
        this.f = f;
    }
    runWith(shared) {
        return this.f(shared);
    }
}
exports.Program = Program;
function program(f) {
    return new Program((f));
}
exports.program = program;
/*
interface Environment {
    ask: () => string
    tell: (s: string) => void
}

const ProductionEnvironment = {
    ask: () => readlineSync.question("What's your name? "),
    tell: (name: string) => console.log(`Hi, ${name}!`)
}

const TestEnvironment = {
    ...ProductionEnvironment,
    ask: () => '[Test name]'
}

const greet = program<Environment, void>(({ ask, tell }) => {
    action(ask)
        .compose(tell)
        .act()
}) */ 
//# sourceMappingURL=Program.js.map