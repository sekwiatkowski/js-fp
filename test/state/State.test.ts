import {Pair, pair, state, stateObject} from '../../src'

require('chai').should()

describe('State', () => {
    const increment = (state: number) => pair(state, state + 1)

    function createRng(): (number) => Pair<number, number> {
        return (seed: number) => {

            function randomInteger(seed) {
                const a = 11, c = 17, m = 25;
                return (a * seed + c) % m;
            }

            const generatedNumber = randomInteger(seed)
            const updatedState = randomInteger(generatedNumber)

            return pair(updatedState, generatedNumber)
        }
    }

    it('can run the computation', () => {
        state(increment)
            .runWith(1)
            .equals(pair(1, 2))
            .should.be.true
    })

    it('can evaluate the computation', () => {
        state(increment)
            .evaluateWith(1)
            .should.equal(2)
    })

    it('can map over the resultant', () => {
        state(increment)
            .map(x => 2 * x)
            .evaluateWith(1)
            .should.equal(4)
    })

    describe('can build an object', () => {
        it('that is equivalent to the result of manual assignments with a constant state', () => {
            const seed = 1

            const rng = createRng()

            const a = rng(seed)
            const b = rng(a.first())
            const c = rng(b.first())
            const d = rng(c.first())

            const withoutState = {
                a: a.second(),
                b: b.second(),
                c: c.second(),
                d: d.second()
            }

            const rngState = state(rng)

            const withState = stateObject()
                .assign('a', rngState)
                .assign('b', () => rngState)
                .assign('c', c.second())
                .assign('d', () => d.second())
                .evaluateWith(seed)

            withoutState.should.eql(withState)
        })

        it('and to the result of manual assignments combined with a replacement of the seed', () => {
            const firstSeed = 1, secondSeed = 1

            const rng = createRng()

            const a = rng(firstSeed)
            const b = rng(a.first())
            const c = rng(secondSeed)
            const d = rng(c.first())

            const withoutState = {
                a: a.second(),
                b: b.second(),
                c: c.second(),
                d: d.second()
            }

            const rngState = state(rng)

            stateObject<number>()
                .assign('a', rngState)
                .assign('b', rngState)
                .replaceState(secondSeed)
                .assign('c', rngState)
                .assign('d', rngState)
                .evaluateWith(firstSeed)
                .should.eql(withoutState)
        })

        it('while being able to access and replace the state', () => {
            stateObject<number>()
                .accessState('first')
                .replaceState(2)
                .accessState('second')
                .evaluateWith(1)
                .should.eql({first: 1, second: 2})
        })
    })

})