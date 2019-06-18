import {DescendingNumberOrder, list, NumberOrder, Order, order, orderBy, orderDescendinglyBy} from '../../src'

const chai = require('chai')
chai.should()

describe('Order', () => {
    interface Employee {
        rank: number,
        experience: number
    }

    const createEmployees = () => list<Employee>(
        {rank: 2, experience: 10},
        {rank: 3, experience: 8},
        {rank: 3, experience: 5},
        {rank: 1, experience: 4})

    const expectedSorting = [
        {rank: 1, experience: 4},
        {rank: 2, experience: 10},
        {rank: 3, experience: 8},
        {rank: 3, experience: 5}
    ]

    const check = (order: Order<Employee>) => createEmployees()
        .sort(order)
        .getArray()
        .should.eql(expectedSorting)

    it('concatenates with a comparison function', () => {
        const comparison = (e1, e2) => DescendingNumberOrder.compare(e1.experience, e2.experience)

        check(order<Employee>((e1, e2) => NumberOrder.compare(e1.rank, e2.rank))
            .concat(comparison))
    })

    it('concatenates with another oder', () => {
        const order = orderDescendinglyBy<Employee, number>(e => e.experience)

        check(orderBy<Employee, number>(e => e.rank)
            .concat(order))
    })

    it('concatenates using thenDescendinglyBy', () => {
        check(orderBy<Employee, number>(e => e.rank)
            .thenDescendinglyBy(e => e.experience))
    })
})