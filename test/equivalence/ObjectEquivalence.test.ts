import {DateEquality, NumberArrayEquality, NumberEquality, objectEquivalence, StringEquality} from '../../src'

const chai = require('chai')
chai.should()

describe('objectEquivalence', () => {
    interface Customer {
        id: number
        name: string,
        orders: number[],
        activity: Activity,
        interests: string[]
    }

    interface Activity {
        signedUp: Date
    }

    it('can be defined partially and works with nested objects', () => {
        const customerEquivalence = objectEquivalence<Customer>({
            id: NumberEquality,
            name: StringEquality,
            orders: NumberArrayEquality,
            activity: objectEquivalence<Activity>({ signedUp: DateEquality })
        })

        const firstId = 1
        const secondId = 2
        const firstName = 'Alice'
        const secondName = 'Bob'
        const firstOrders = [1, 2]
        const secondOrders = [3]
        const firstActivity = { signedUp: new Date(2019, 0, 1) }
        const secondActivity = { signedUp: new Date(2019, 0, 2) }

        const interests = null

        const firstCustomer = { id: firstId, name: firstName, orders: firstOrders, activity: firstActivity, interests }
        customerEquivalence.test(firstCustomer, { id: firstId, name: firstName, orders: firstOrders, activity: firstActivity, interests }).should.be.true

        customerEquivalence.test(firstCustomer, { id: secondId, name: firstName, orders: firstOrders, activity: firstActivity, interests }).should.be.false
        customerEquivalence.test(firstCustomer, { id: firstId, name: secondName, orders: firstOrders, activity: firstActivity, interests }).should.be.false
        customerEquivalence.test(firstCustomer, { id: firstId, name: firstName, orders: secondOrders, activity: firstActivity, interests }).should.be.false
        customerEquivalence.test(firstCustomer, { id: firstId, name: firstName, orders: firstOrders, activity: secondActivity, interests }).should.be.false
    })

})