"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Order {
    constructor(f) {
        this.f = f;
    }
    get() {
        return this.f;
    }
    compare(x, y) {
        return this.f(x, y);
    }
    adapt(f) {
        return new Order((x, y) => this.compare(f(x), f(y)));
    }
    invert() {
        return new Order((x, y) => this.compare(y, x));
    }
    min() {
        return (x, y) => this.compare(x, y) === 1 ? x : y;
    }
    max() {
        return (x, y) => this.compare(x, y) === -1 ? x : y;
    }
    concat(otherOrFunction) {
        const other = otherOrFunction instanceof Function ? exports.order(otherOrFunction) : otherOrFunction;
        return new Order((x, y) => {
            const firstComparison = this.compare(x, y);
            if (firstComparison == 0) {
                return other.compare(x, y);
            }
            else {
                return firstComparison;
            }
        });
    }
    thenBy(by, byOrder) {
        return this.concat(orderBy(by, byOrder));
    }
    thenDescendinglyBy(by, byOrder) {
        return this.concat(orderBy(by, byOrder).invert());
    }
}
exports.Order = Order;
exports.order = (f) => new Order(f);
exports.AnyOrder = exports.order((x, y) => x < y ? -1 : x > y ? 1 : 0);
exports.DescendingAnyOrder = exports.AnyOrder.invert();
function orderBy(by, byOrder) {
    return exports.order((x, y) => (byOrder || exports.AnyOrder).compare(by(x), by(y)));
}
exports.orderBy = orderBy;
function orderDescendinglyBy(by, byOrder) {
    return orderBy(by, byOrder).invert();
}
exports.orderDescendinglyBy = orderDescendinglyBy;
exports.NumberOrder = exports.AnyOrder;
exports.StringOrder = exports.AnyOrder;
exports.BooleanOrder = exports.AnyOrder;
exports.DateOrder = exports.AnyOrder.adapt(date => date.valueOf());
exports.DescendingNumberOrder = exports.DescendingAnyOrder;
exports.DescendingStringOrder = exports.DescendingAnyOrder;
exports.DescendingBooleanOrder = exports.DescendingAnyOrder;
exports.DescendingDateOrder = exports.DateOrder.invert();
//# sourceMappingURL=Order.js.map