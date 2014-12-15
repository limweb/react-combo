'use strict';

var Region = require('region')
var assign = require('object-assign')
var selectParent = require('select-parent')

module.exports = function(props, listProps, constrainTo){
    var constrainRegion

    if (constrainTo === true){
        constrainRegion = Region.getDocRegion()
    }

    if (typeof constrainTo === 'string'){
        var parent = selectParent(constrainTo, this.getDOMNode())
        constrainRegion = Region.from(parent)
    }

    if (typeof constrainTo === 'function'){
        constrainRegion = Region.from(constrainTo())
    }

    var input = this.getInput()

    if (!input){
        return
    }

    var inputRegion = Region.from(input)

    if (typeof props.constrainList === 'function'){
        props.constrainList(listProps, inputRegion, constrainRegion)
        return
    }

    if (!constrainRegion || !(constrainRegion instanceof Region)){
        return
    }

    var topAvailable    = inputRegion.top - constrainRegion.top
    var bottomAvailable = constrainRegion.bottom - inputRegion.bottom

    var max = bottomAvailable

    var style = assign(listProps.style)

    if (topAvailable > bottomAvailable){
        style.position = 'absolute'
        style.width    = '100%'
        style.bottom   = '100%'
        max            = topAvailable
    }

    listProps.listMaxHeight = Math.max(50, max - 10)
}