import {emptyList, List, NonEmptyList, repeat, Result} from '..'

export class Program<I, T, E> {
    constructor(private readonly f: (instructions : I) => Result<T, E>) {}

    withInstructions(instructions: I): Runner<T, E> {
        return new Runner(() => this.f(instructions))
    }
}

function attempt<T, E>(f: () => Result<T, E>, results: List<Result<T, E>>|NonEmptyList<Result<T, E>>, attemptsLeft: number): NonEmptyList<Result<T, E>> {
    if(attemptsLeft === 0) {
        return results as NonEmptyList<Result<T, E>>
    }

    const result = f()

    return attempt(f, results.append(result), result.isSuccess() ? 0 : --attemptsLeft)
}

class Runner<T, E> {
    constructor(private readonly f: () => Result<T, E>) {}

    repeat(times: number): List<Result<T, E>> {
        return repeat(times, () => this.f())
    }

    attempt(times: number): NonEmptyList<Result<T, E>> {
        return  attempt(this.f, emptyList(), times)
    }

    run(): Result<T, E> {
        return this.f()
    }
}

export function program<I, T, E>(f: (instructions : I) => Result<T, E>): Program<I, T, E> {
    return new Program<I, T, E>(f)
}