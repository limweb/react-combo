'use strict';

var document = global.document

module.exports = function getSelectionEnd(o) {
    if (o.createTextRange && !window.getSelection) {
        var r = document.selection.createRange().duplicate()
        r.moveStart('character', -o.value.length)
        return r.text.length
    } else return o.selectionEnd
}
