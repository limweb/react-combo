'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactClass = require('react-class');

var _reactClass2 = _interopRequireDefault(_reactClass);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _join = require('../join');

var _join2 = _interopRequireDefault(_join);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Item = function (_Component) {
  _inherits(Item, _Component);

  function Item() {
    _classCallCheck(this, Item);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Item).apply(this, arguments));
  }

  _createClass(Item, [{
    key: 'render',
    value: function render() {

      var props = this.props;
      var data = props.data;

      var className = (0, _join2.default)(props.className, 'react-combo__list-item', props.current ? 'react-combo__list-item--current' : null, props.selected ? 'react-combo__list-item--selected' : null);

      props = (0, _objectAssign2.default)({}, props, {
        className: className,
        children: props.children
      });

      var item = undefined;

      if (props.renderItem) {
        item = props.renderItem(props);
      }

      if (item === undefined) {
        props.data = null;
        item = _react2.default.createElement('li', props);
      }

      return item;
    }
  }]);

  return Item;
}(_reactClass2.default);

exports.default = Item;


Item.propTypes = {
  getItemId: _react.PropTypes.func,
  getItemLabel: _react.PropTypes.func
};