"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (row, dir) {
  if (!row) {
    return false;
  }

  var parentNode = row.parentNode;

  var scrollTop = parentNode.scrollTop;
  var parentHeight = parentNode.offsetHeight;
  var scrollBottom = scrollTop + parentHeight;
  var rowTop = row.offsetTop;
  var rowBottom = rowTop + row.offsetHeight;

  if (rowTop < scrollTop || rowBottom > scrollBottom) {

    dir < 0 ?
    //going upwards
    parentNode.scrollTop = rowTop :

    //going downwards
    parentNode.scrollTop = rowBottom - parentHeight;

    return true;
  }

  return false;
};