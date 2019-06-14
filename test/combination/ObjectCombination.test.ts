import {All, Any, Earliest, Latest, objectCombination, Sum} from '../../src'
import {ArrayConcatenation} from '../../src/combination/Monoid'

const chai = require('chai')
chai.should()

describe('objectCombination', () => {

    interface OrderHistory {
        hasOrdered: boolean
    }

    interface Activity {
        signedUp: Date
        lastLogin: Date
        clicks: number
    }

    interface Customer {
        activity: Activity
        orders: OrderHistory,
        interests: string[],
        hasOptedIn: boolean
    }

    it('should work with nested objects', () => {
        const firstInterests = ['reading']
        const firstSignUp = new Date(2019, 1, 1)
        const firstClicks = 5
        const firstObject = {
            interests: firstInterests,
            activity: {
                signedUp: firstSignUp,
                clicks: firstClicks,
                lastLogin: new Date(2019, 1, 1)
            },
            orders: {
                hasOrdered: false
            },
            hasOptedIn: false
        }

        const secondInterests = ['sports']
        const secondClicks = 10
        const secondLastLogin = new Date(2019, 4, 5)
        const secondObject = {
            interests: secondInterests,
            activity: {
                signedUp: new Date(2019, 2, 3),
                lastLogin: secondLastLogin,
                clicks: secondClicks
            },
            orders: {
                hasOrdered: true
            },
            hasOptedIn: false
        }

        const scheme = objectCombination<Customer>({
            interests: ArrayConcatenation,
            activity: objectCombination({
                signedUp: Earliest,
                lastLogin: Latest,
                clicks: Sum
            }),
            orders: objectCombination({
                hasOrdered: Any
            }),
            hasOptedIn: All
        })

        const combined = scheme.combine(firstObject)(secondObject)

        combined.hasOptedIn.should.be.false
        combined.interests.should.eql(firstInterests.concat(secondInterests))
        combined.orders.hasOrdered.should.be.true
        combined.activity.clicks.should.equal(firstClicks + secondClicks)
        combined.activity.signedUp.should.equal(firstSignUp)
        combined.activity.lastLogin.should.equal(secondLastLogin)
    })

})