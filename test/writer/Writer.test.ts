import {
    createListEquality,
    createWriterEquality,
    emptyList,
    identity,
    listFromArray,
    listWriter,
    pair,
    predicate,
    Semigroup,
    stringWriter,
    writer
} from '../../src'
import {listWriterObject} from '../../src/writer/Writer'
import {StringConcatenation} from '../../src/combination/Monoid'

require('chai').should()

const joinWithNewline: Semigroup<string> = { combine: x => y => x + '\n' + y }

describe('Writer', () => {
    const initialValue = 1
    const initialLog = 'initial log'
    const createNumberStringWriter = (value: number = initialValue, log: string = initialLog) => stringWriter(value, log)

    describe('can return', () => {
        it('the value', () => {
            createNumberStringWriter()
                .getValue()
                .should.equal(initialValue)
        })

        it('the log', () => {
            createNumberStringWriter()
                .getLog()
                .should.equal(initialLog)
        })

        it('both', () => {
            const [accessedValue, accessedLog] = createNumberStringWriter()
                .get()
                .toArray()

            accessedValue.should.equal(initialValue)
            accessedLog.should.equal(initialLog)
        })
    })

    describe('can map', () => {
        const mapOverValue = (x: number) => x + 1
        const mapOverLogToAnotherString = (log: string) => `mapped over ${log}`
        const mapOverLogToArray = (log: string) => [log]

        it('over the value', () => {
            createNumberStringWriter()
                .map(mapOverValue)
                .getValue()
                .should.equal(mapOverValue(initialValue))
        })

        describe('over the log', () => {
            createNumberStringWriter()
                .mapLog(mapOverLogToAnotherString)
                .getLog()
                .should.equal(mapOverLogToAnotherString(initialLog))
        })
    })

    describe('can chain', () => {
        it('other writers', () => {
            const increment = (x: number) => listWriter(x + 1, 'Incremented')
            const double = (x: number) => listWriter(2 * x, 'Doubled')

            const chained = listWriter(1)
                .chain(increment)
                .chain(double)

            chained.getLog().getArray().should.eql(['Incremented', 'Doubled'])
            chained.getValue().should.equal(4)
        })

        it('pairs of functions and logs', () => {
            const chained = listWriter(1)
                .chain(x => x + 1, 'Incremented')
                .chain(x => 2 * x, 'Doubled')

            chained.getLog().getArray().should.eql(['Incremented', 'Doubled'])
            chained.getValue().should.equal(4)
        })
    })

    describe('can perform side-effects', () => {
        const noSideEffect = 'no side-effect'
        const valueSideEffectText = 'value side-effect'
        const logSideEffectText = 'log side-effect'
        const createStringStringWriter = () => stringWriter(valueSideEffectText, logSideEffectText)

        it('on the value', () => {
            let mutable = noSideEffect
            createStringStringWriter()
                .perform(value => mutable = value)
            mutable.should.equal(valueSideEffectText)
        })

        it('on the log', () => {
            let mutable = noSideEffect
            createStringStringWriter()
                .performOnLog(log => mutable = log)
            mutable.should.equal(logSideEffectText)
        })

        it('on both', () => {
            let firstMutable = noSideEffect
            let secondMutable = noSideEffect
            createStringStringWriter()
                .performOnBoth((value, log) => {
                    firstMutable = value
                    secondMutable = log
                })
            firstMutable.should.equal(valueSideEffectText)
            secondMutable.should.equal(logSideEffectText)
        })
    })

    describe('can test', () => {
        describe('predicates', () => {
            const isEven = (x: number) => x % 2 === 0

            it('using functions', () => {

                createNumberStringWriter(1).test(isEven).should.be.false
                createNumberStringWriter(2).test(isEven).should.be.true
            })

            it('using Predicate instances', () => {
                const isEvenPredicate = predicate(isEven)

                createNumberStringWriter(1).test(isEvenPredicate).should.be.false
                createNumberStringWriter(2).test(isEvenPredicate).should.be.true
            })

        })

        it('for equality', () => {
            const equality = createWriterEquality<number, string>()

            createNumberStringWriter().equals(createNumberStringWriter(), equality).should.be.true
            createNumberStringWriter().equals(stringWriter(2, initialLog), equality).should.be.false
            createNumberStringWriter().equals(stringWriter(initialValue, 'other log'), equality).should.be.false
        })
    })

    describe('can modify the log', () => {
        it('through a reset', () => {
            const initialLogText = 'initial string log'

            stringWriter(undefined, initialLogText)
                .reset()
                .getLog()
                .should.equal('')

            listWriter(undefined, initialLogText)
                .reset()
                .getLog()
                .getArray()
                .should.eql([])
        })

        it('through a combination with another log', () => {
            stringWriter(undefined,'first', joinWithNewline)
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

    describe('can build an object', () => {
        it('with writers', () => {
            listWriterObject()
                .assign('a', listWriter(1, 'first member'))
                .assign('b', () => listWriter(2, 'second member'))
                .get()
                .should.eql(pair({a: 1, b: 2}, listFromArray(['first member', 'second member'])))
        })

        it('with values', () => {
            listWriterObject()
                .assign('a', 1)
                .assign('b', 2)
                .get()
                .should.eql(pair({a: 1, b: 2}, emptyList()))
        })

        it('with values and log items', () => {
            listWriterObject()
                .assign('a', 1, 'first member')
                .assign('b', 2, 'second member')
                .get()
                .should.eql(pair({a: 1, b: 2}, listFromArray(['first member', 'second member'])))
        })
    })
})

describe('writer', () => {
    describe('can be constructed with a monoid', () => {
        it('without an initial log', () => {
            writer<undefined, string>(undefined, identity, StringConcatenation, 'A')
                .chain(() => writer(undefined, identity, StringConcatenation, 'B'))
                .getLog()
                .should.equal('AB')
        })

        it('with an initial log', () => {
            writer<undefined, string>(undefined, identity, StringConcatenation)
                .chain(() => writer(undefined, identity, StringConcatenation))
                .getLog()
                .should.equal('')
        })
    })

    it('can be constructed with a semigroup', () => {
        writer<undefined, string>(undefined, identity, joinWithNewline, 'A')
            .chain(() => writer(undefined, identity, joinWithNewline, 'B'))
            .getLog()
            .should.equal('A\nB')
    })
})