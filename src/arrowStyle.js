'use strict'

module.exports = function arrowStyle(side, props){

    var arrowSize   = props.arrowSize
    var arrowWidth  = props.arrowWidth  || arrowSize
    var arrowHeight = props.arrowHeight || arrowSize
    var arrowColor  = props.arrowColor

    var style = {
        borderLeft : arrowWidth + 'px solid transparent',
        borderRight: arrowWidth + 'px solid transparent',

        marginTop: -Math.round(arrowHeight/2) + 'px',
        position : 'relative',

        top: '50%'
    }

    style[side === 'up'? 'borderBottom': 'borderTop'] = arrowHeight + 'px solid ' + arrowColor

    return style
}