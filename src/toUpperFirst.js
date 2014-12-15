'use strict'

module.exports = function toUpperFirst(str){
    if (!str){
        return str
    }

    return str.charAt(0).toUpperCase() + str.substring(1)
}