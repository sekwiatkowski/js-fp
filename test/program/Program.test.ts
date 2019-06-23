import {
    createListEquality,
    createNonEmptyListEquality,
    createResultEquality,
    failure,
    list,
    listFromArray,
    program,
    Result,
    success
} from '../../src'

require('chai').should()

/* interface Instructions {
        Ask: (question: string) => string,
        Greet: (name: string) => void
    }

    const TestInstructions: Instructions = {
        Ask: () => 'Test name',
        Greet: name => console.log(`Hi ${name}!`)
    }

    const ProductionInstructions: Instructions = {
        Ask: (question: string) => readlineSync.question(question + ' '),
        Greet: name => `Hi ${name}`
    }

    const greetProgram = ({ Ask, Greet }: Instructions)  =>
        resultObject<undefined>()
            .assign('name', Ask('May I have your name?'))
            .perform(scope => Greet(scope.name))
            .map(() => 1)

    program(greetProgram)
        .withInstructions(TestInstructions)
        .repeat(3) */

describe('Programs', () => {
    const successMessage = 'success'
    const failureMessage = 'failure'

    const alwaysSucceed = (message: string) => success(message)
    const alwaysFail = (message: string) => failure(message)
    const createProgramThatSuceedsOnce = (succeedAtStep: number) => {
        let counter = 1

        function program(instructions: { successMessage: string, failureMessage: string }): Result<string, string> {
            return counter++ === succeedAtStep
                ? success<string, string>(instructions.successMessage)
                : failure<string, string>(instructions.failureMessage)
        }

        return program
    }

    it('can run', () => {
        program(alwaysSucceed)
            .withInstructions(successMessage)
            .run()
            .equals(success(successMessage), createResultEquality())
            .should.be.true

        program(alwaysFail)
            .withInstructions(failureMessage)
            .run()
            .equals(failure('failure'), createResultEquality())
            .should.be.true
    })

    it('can run repeatedly', () => {
        program(alwaysSucceed)
            .withInstructions(successMessage)
            .repeat(3)
            .equals(listFromArray<Result<string, any>>([success(successMessage), success(successMessage), success(successMessage)]), createListEquality(createResultEquality()))
            .should.be.true

        program(alwaysFail)
            .withInstructions(failureMessage)
            .repeat(3)
            .equals(listFromArray<Result<any, string>>([failure(failureMessage), failure(failureMessage), failure(failureMessage)]), createListEquality(createResultEquality()))
            .should.be.true
    })

    it('can attempt to run', () => {
        /* program(createProgramThatSuceedsOnce(2))
            .withInstructions({ successMessage, failureMessage })
            .attempt(1)
            .equals(list<Result<string, string>>(failure(failureMessage)), createNonEmptyListEquality(createResultEquality()))
            .should.be.true */

        program(createProgramThatSuceedsOnce(2))
            .withInstructions({ successMessage, failureMessage })
            .attempt(2)
            .equals(list<Result<string, string>>(failure(failureMessage), success(successMessage)), createNonEmptyListEquality(createResultEquality()))
            .should.be.true

        program(createProgramThatSuceedsOnce(2))
            .withInstructions({ successMessage, failureMessage })
            .attempt(3)
            .equals(list<Result<string, string>>(failure(failureMessage), success(successMessage)), createNonEmptyListEquality(createResultEquality()))
            .should.be.true
    })

})