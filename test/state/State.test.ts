import {createPairEquality, pair, state, stateObject} from '../../src'

require('chai').should()

describe('State', () => {
    const increment = (state: number) => pair(state, state + 1)

    const rng = (seed: number) => {
        function randomInteger(z: number) {
            const a = 11, c = 17, m = 25;
            return (a * z + c) % m;
        }

        const generatedNumber = randomInteger(seed)
        const updatedState = randomInteger(generatedNumber)

        return pair(updatedState, generatedNumber)
    }

    it('can run the computation', () => {
        state(increment)
            .runWith(1)
            .equals(pair(1, 2), createPairEquality())
            .should.be.true
    })

    it('can evaluate the computation', () => {
        state(increment)
            .evaluateWith(1)
            .should.equal(2)
    })

    it('can access the function that maps the state of type S to the value of type A', () => {
        state(increment)
            .get()(1)
            .equals(pair(1, 2), createPairEquality())
            .should.be.true
    })

    describe('can map', () => {
        it('over the resultant', () => {
            state(increment)
                .map(x => 2 * x)
                .runWith(1)
                .equals(pair(1, 4), createPairEquality())
                .should.be.true
        })

        describe('over the state', () => {
            state(increment)
                .mapState(() => 3)
                .runWith(1)
                .equals(pair(3, 2), createPairEquality())
                .should.be.true
        })
    })

    it('can perform side-effects', () => {
        let mutable = 'no side-effect'
        const sideEffectText = 'side-effect'

        state(increment)
            .perform(() => mutable = sideEffectText)
            .runWith(1)

        mutable.should.equal(sideEffectText)
    })

    it('can chain', () => {
        const seed = 1
        const firstPair = rng(seed)
        const secondPair = rng(firstPair.first())

        const unchained = state(rng)
        const chained = unchained.chain(() => state(rng))

        const pairEquality = createPairEquality<number, number>()
        pairEquality.test(firstPair, unchained.runWith(seed)).should.be.true
        pairEquality.test(secondPair, chained.runWith(seed)).should.be.true
    })

    describe('can build an object', () => {
        const seed = 1

        // Create the object manually without a comprehension
        const firstRandom = rng(1)
        const secondRandom = rng(firstRandom.first())
        const thirdRandom = rng(secondRandom.first())
        const expectedEndResultant = {
            seed,
            'firstNonStateful': 1,
            'firstState': firstRandom.first(),
            'firstNumber': firstRandom.second(),
            'secondNonStateful': 2,
            'secondState': secondRandom.first(),
            'secondNumber': secondRandom.second(),
            'thirdNonStateful': 3,
            'thirdState': thirdRandom.first(),
            'thirdNumber': thirdRandom.second(),
        }
        const expectedEndState = thirdRandom.first()

        function check(actualEndState: number, actualEndResultant: object) {
            actualEndState.should.equal(expectedEndState)
            actualEndResultant.should.eql(expectedEndResultant)
        }
        const stateRng = state(rng)

        it('that keeps track of state changes with eager computation', () => {
            const withComprehension = stateObject<number>()
                .assignState('seed')
                .assign('firstNonStateful', 1)
                .assign('firstNumber', stateRng)
                .assignState('firstState')
                .assign('secondNonStateful', 2)
                .assign('secondNumber', stateRng)
                .assignState('secondState')
                .assign('thirdNonStateful', 3)
                .assign('thirdNumber', stateRng)
                .assignState('thirdState')
                .runWith(seed)

            check(withComprehension.first(), withComprehension.second())
        })

        it('... and with deferred computation', () => {
            const withComprehension = stateObject<number>()
                .assignState('seed')
                .assign('firstNonStateful', () => 1)
                .assign('firstNumber', () => stateRng)
                .assignState('firstState')
                .assign('secondNonStateful', () => 2)
                .assign('secondNumber', () => stateRng)
                .assignState('secondState')
                .assign('thirdNonStateful', () => 3)
                .assign('thirdNumber', () => stateRng)
                .assignState('thirdState')
                .runWith(seed)

            check(withComprehension.first(), withComprehension.second())
        })
    })

})

describe('stateObject', () => {
    it('should return a State instance that, when run, returns a pair of the state and an empty object', () => {
        const stateInput = 'state'
        const actualState = stateObject<string>().runWith(stateInput)
        actualState.first().should.equal(stateInput)
        actualState.second().should.be.empty
    })
})