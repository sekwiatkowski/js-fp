import {listWriter, stringWriter} from '../../src/writer/Writer'

require('chai').should()

describe('Writer', () => {
    const value = 1
    const log = 'initial log'
    const createWriter = () => stringWriter(value, log)

    describe('can return', () => {
        it('the value', () => {
            createWriter()
                .getValue()
                .should.equal(value)
        })

        it('the log', () => {
            createWriter()
                .getLog()
                .should.equal(log)
        })

        it('both', () => {
            const [accessedValue, accessedLog] = createWriter()
                .get()
                .toArray()

            accessedValue.should.equal(value)
            accessedLog.should.equal(log)
        })
    })

    it('can map', () => {
        listWriter(1)
            .map(x => x + 1)
            .getValue()
            .should.equal(2)
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