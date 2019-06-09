export const compare = (a: any, b: any) => {
    const aIsNull = a === null
    const bIsNull = b === null

    if (aIsNull) {
        if (bIsNull) {
            return 0
        }
        else if (typeof b === 'undefined') {
            return -1
        }
        else {
            return 1
        }
    }
    else if (typeof a === 'undefined') {
        if (bIsNull) {
            return 1
        }
        else if (typeof b === 'undefined') {
            return 0
        }
        else {
            return 1
        }
    }
    // a is neither null nor undefined
    else if (bIsNull || typeof b === 'undefined') {
        return -1
    } else {
        return a < b ? -1 : (a > b ? 1 : 0)
    }
}

export const negatedCompare = (a, b) => -compare(a, b)

export const compareBy = (a: any, b: any, f: (value: any) => any) => compare(f(a), f(b))

export const negatedCompareBy = (a: any, b: any, f: (value: any) => any) => -compareBy(a, b, f)