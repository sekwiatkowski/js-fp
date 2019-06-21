import {
    ArrayConcatenation,
    createListEquality,
    createWriterEquality,
    listFromArray,
    listWriter,
    predicate,
    stringWriter,
    writer
} from '../../src'
import {StringConcatenation} from '../../src/combination/Monoid'
import {ListConcatenation} from '../../src/list/List'

require('chai').should()

describe('Writer', () => {
    const defaultValue = 1
    const defaultLog = 'initial log'
    const createStringWriter = (value: number = defaultValue, log: string = defaultLog) => stringWriter(value, log)

    describe('can return', () => {
        it('the value', () => {
            createStringWriter()
                .getValue()
                .should.equal(defaultValue)
        })

        it('the log', () => {
            createStringWriter()
                .getLog()
                .should.equal(defaultLog)
        })

        it('both', () => {
            const [accessedValue, accessedLog] = createStringWriter()
                .get()
                .toArray()

            accessedValue.should.equal(defaultValue)
            accessedLog.should.equal(defaultLog)
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
                .should.equal(mapOverValue(defaultValue))
        })

        describe('over the log', () => {
            it('without a monoid', () => {
                createStringWriter()
                    .mapLog(mapOverLogToAnotherString)
                    .getLog()
                    .should.equal(mapOverLogToAnotherString(defaultLog))
            })

            it('with a monoid', () => {
                createStringWriter()
                    .mapLog(mapOverLogToArray, ArrayConcatenation)
                    .getLog()
                    .should.eql(mapOverLogToArray(defaultLog))
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

    describe('can modify the log', () => {
        it('through a reset', () => {
            stringWriter(undefined, 'log')
                .reset()
                .getLog()
                .should.equal(StringConcatenation.identityElement)

            listWriter(undefined, 'log')
                .reset()
                .getLog()
                .should.equal(ListConcatenation.identityElement)
        })

        it('through a combination with a another log', () => {
            writer(undefined, { combine: x => y => x + '\n' + y, identityElement: '' }, 'first')
                .tell('second')
                .getLog()
                .should.equal('first\nsecond')

            listWriter(undefined, listFromArray(['first']))
                .tell(listFromArray(['second']))
                .getLog()
                .equals(listFromArray(['first', 'second']), createListEquality())
                .should.be.true
        })
    })

    describe('can perform side-effects', () => {
        it('on the value', () => {
            let mutable = null
            createStringWriter()
                .perform(value => mutable = value)
            mutable.should.equal(defaultValue)
        })

        it('on the log', () => {
            let mutable = null
            createStringWriter()
                .performOnLog(log => mutable = log)
            mutable.should.equal(defaultLog)
        })

        it('on both', () => {
            let firstMutable = null
            let secondMutable = null
            createStringWriter()
                .performOnBoth((value, log) => {
                    firstMutable = value
                    secondMutable = log
                })
            firstMutable.should.equal(defaultValue)
            secondMutable.should.equal(defaultLog)
        })
    })

    describe('can test', () => {
        describe('predicates', () => {
            const isEven = (x: number) => x % 2 === 0

            it('using functions', () => {

                createStringWriter(1).test(isEven).should.be.false
                createStringWriter(2).test(isEven).should.be.true
            })

            it('using Predicate instances', () => {
                const isEvenPredicate = predicate(isEven)

                createStringWriter(1).test(isEvenPredicate).should.be.false
                createStringWriter(2).test(isEvenPredicate).should.be.true
            })

        })

        it('for equality', () => {
            const equality = createWriterEquality()

            createStringWriter().equals(createStringWriter(), equality).should.be.true
            createStringWriter().equals(stringWriter(2, defaultLog), equality).should.be.false
            createStringWriter().equals(stringWriter(defaultValue, 'other log'), equality).should.be.false
        })
    })
})