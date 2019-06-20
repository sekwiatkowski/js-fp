import {ArrayConcatenation} from '../../src/combination/Monoid'
import {listWriter, stringWriter} from '../../src'

require('chai').should()

describe('Writer', () => {
    const value = 1
    const log = 'initial log'
    const createStringWriter = () => stringWriter(value, log)

    describe('can return', () => {
        it('the value', () => {
            createStringWriter()
                .getValue()
                .should.equal(value)
        })

        it('the log', () => {
            createStringWriter()
                .getLog()
                .should.equal(log)
        })

        it('both', () => {
            const [accessedValue, accessedLog] = createStringWriter()
                .get()
                .toArray()

            accessedValue.should.equal(value)
            accessedLog.should.equal(log)
        })
    })

    describe('can map', () => {
        const mapOverValue = x => x + 1
        const mapOverLogToAnotherString = (log: string) => `mapped over ${log}`
        const mapOverLogToArray = log => [log]

        it('over the value', () => {
            createStringWriter()
                .map(mapOverValue)
                .getValue()
                .should.equal(mapOverValue(value))
        })

        describe('over the log', () => {
            it('without a monoid', () => {
                createStringWriter()
                    .mapLog(mapOverLogToAnotherString)
                    .getLog()
                    .should.equal(mapOverLogToAnotherString(log))
            })

            it('with a monoid', () => {
                createStringWriter()
                    .mapLog(mapOverLogToArray, ArrayConcatenation)
                    .getLog()
                    .should.eql(mapOverLogToArray(log))
            })
        })

        describe('over both', () => {
            it('without a monoid', () => {
                const mapped = createStringWriter()
                    .mapBoth(mapOverValue, mapOverLogToAnotherString)

                mapped.getValue().should.equal(mapOverValue(value))
                mapped.getLog().should.eql(mapOverLogToAnotherString(log))
            })

            it('with a monoid', () => {
                const mapped = createStringWriter()
                    .mapBoth(mapOverValue, mapOverLogToArray, ArrayConcatenation)

                mapped.getValue().should.equal(mapOverValue(value))
                mapped.getLog().should.eql(mapOverLogToArray(log))
            })
        })
    })

    it('can chain', () => {
        const increment = (x: number) => listWriter(x+1, 'Incremented')
        const double = (x: number) => listWriter(2*x, 'Doubled')

        const chained = listWriter(1)
            .chain(increment)
            .chain(double)

        chained.getLog().getArray().should.eql(['Incremented', 'Doubled'])
        chained.getValue().should.equal(4)
    })
})