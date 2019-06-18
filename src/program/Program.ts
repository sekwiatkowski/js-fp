export class Program<E, T> {
    constructor(private f: (shared: E) => T) {}

    run(shared: E): T {
        return this.f(shared)
    }
}

export function program<E = void, T = void>(f: (environment: E) => T): Program<E, T> {
    return new Program((f))
}

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