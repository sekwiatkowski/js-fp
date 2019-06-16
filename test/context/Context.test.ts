import {context, contextualObject} from '../../src/context/Context'

const chai = require('chai')
chai.should()

describe('Context', () => {

    describe('can assign', () => {
        it('without context', () => {
            contextualObject()
                .assign('a', 1)
                .assign('b', () => 2)
                .assign('c', context(() => 3))
                .assign('d', () => context(() => 4))
                .map(scope => scope.a + scope.b + scope.c + scope.d)
                .runWith({})
                .should.equal(10)
        })

        it('with context', () => {
            // Inspired by: https://www.originate.com/thinking/stories/reader-monad-for-dependency-injection/
            interface User {
                id: number
                name: string,
                supervisorId: number
            }

            const users: User[] = [
                { id: 1, name: 'A', supervisorId: null },
                { id: 2, name: 'B', supervisorId: 1 }
            ]

            class UserRepository {
                getUserByName(name: string) {
                    return users.find(u => u.name === name)
                }
                getUserById(id: number) {
                    return users.find(u => u.id == id)
                }
            }

            contextualObject<UserRepository>()
                .assignWithContext('worker', ctx => ctx.getUserByName('A'))
                .assignWithContext('supervisor', (ctx, scope) => ctx.getUserById(scope.worker.id))
                .map(scope => scope.supervisor.id)
                .runWith(new UserRepository())
                .should.equal(1)
        })
    })

    describe('can chain', () => {
        context<number, number>(increment => increment)
            .chain(x => context(increment => x + increment))
            .runWith(1)
            .should.equal(2)
    })

    describe('can perform side-effects', () => {
        it('without context', () => {
            let mutable = 0
            contextualObject()
                .perform(() => mutable++)
                .perform(() => mutable++)
                .runWith({})

            mutable.should.equal(2)
        })

        it('with context', () => {
            let mutable = 0
            const shared = {increment: 2}
            contextualObject<{increment: number}>()
                .performWithContext(context => mutable += context.increment)
                .performWithContext(context => mutable += context.increment)
                .runWith(shared)

            mutable.should.equal(2 * shared.increment)
        })
    })

    describe('can test', () => {
        it('for equality', () => {
            const ctx = context(() => 1)

            ctx
                .equals(1)
                .runWith({})
                .should.be.true

            ctx
                .equals(2)
                .runWith({})
                .should.be.false
        })

        it('a predicate', () => {
            const isEven = x => x % 2 == 0

            context(() => 1)
                .test(isEven)
                .runWith({})
                .should.be.false

            context(() => 2)
                .test(isEven)
                .runWith({})
                .should.be.true
        })
    })

})