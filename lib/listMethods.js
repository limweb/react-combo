'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _List = require('./List');

var _List2 = _interopRequireDefault(_List);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderList = function renderList(props) {

  var expanded = props.expanded;
  var currentIndex = this.state.currentIndex;
  var loading = this.state.loading;

  var listProps = {
    visible: expanded,
    expanded: expanded,
    loading: loading,
    currentIndex: currentIndex,
    data: props.data,
    getItemId: this.getItemId,
    getItemLabel: this.getItemLabel,
    idProperty: props.idProperty,
    displayProperty: props.displayProperty,
    disabledProperty: props.disabledProperty,
    renderItem: props.renderItem,
    listPosition: props.listPosition,
    selectedMap: props.selectedMap,
    onItemMouseDown: this.onItemMouseDown,
    onItemMouseEnter: this.onItemMouseEnter
  };

  if (props.childList) {
    return _react2.default.cloneElement(props.childList, listProps);
  }

  var list = undefined;

  if (props.renderList) {
    list = props.onRenderList(listProps);
  }

  if (list === undefined) {
    list = _react2.default.createElement(_List2.default, listProps);
  }

  return list;
};

var onItemMouseDown = function onItemMouseDown(item, id, index, event) {
  event.preventDefault();

  this.trySelectAt(index);

  this.props.onItemMouseDown(item, id, index);
};

var onItemMouseEnter = function onItemMouseEnter(item, id, index) {
  this.setState({
    currentIndex: index
  });

  this.props.onItemMouseEnter(item, id, index);
};

exports.default = {
  renderList: renderList,
  onItemMouseDown: onItemMouseDown,
  onItemMouseEnter: onItemMouseEnter
};