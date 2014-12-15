'use strict';

module.exports = function(value, arr, displayProperty) {

    value = (value + '').toLowerCase()

    return arr.filter(function(item){
        var prop = (item[displayProperty] + '').toLowerCase()

        return prop.indexOf(value) === 0
    })
}