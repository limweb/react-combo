'use strict'


module.exports = function findIndexBy(fn, data){

    var i   = 0
    var len = data.length
    var it

    var displayValue

    for (; i < len; i++ ){
        if (fn(data[i], i, data) === true){
            return i
        }
    }

    return -1
}