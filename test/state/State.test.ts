import {Pair, pair, state} from '../../src'

import {stateObject} from '../../src/state/State'

const chai = require('chai')
chai.should()

describe('State', () => {
    const increment = (state: number) => pair(state, state + 1)

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

        it('which works like manual assignments', () => {
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
    })
})