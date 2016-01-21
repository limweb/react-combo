'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactClass = require('react-class');

var _reactClass2 = _interopRequireDefault(_reactClass);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DOWN = '▼';
var UP = '▲';

var ExpandTool = function (_Component) {
  _inherits(ExpandTool, _Component);

  function ExpandTool() {
    _classCallCheck(this, ExpandTool);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ExpandTool).apply(this, arguments));
  }

  _createClass(ExpandTool, [{
    key: 'render',
    value: function render() {
      var props = this.props;

      var toolProps = (0, _objectAssign2.default)({}, props, {
        className: 'react-combo__expand-tool',
        onMouseDown: this.onMouseDown,
        children: props.expanded ? UP : DOWN,
        expanded: props.expanded
      });

      var renderExpandTool = props.renderExpandTool;

      var result = undefined;

      if (renderExpandTool) {
        result = renderExpandTool(toolProps);
      }
      if (result === undefined) {
        result = _react2.default.createElement('div', toolProps);
      }
      return result;
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {
      //prevent default so that the field does not get blurred
      this.props.focused && event.preventDefault();

      var expanded = !this.props.expanded;

      this.props.onExpandChange(expanded);
    }
  }]);

  return ExpandTool;
}(_reactClass2.default);

exports.default = ExpandTool;

ExpandTool.propTypes = {
  focused: _react.PropTypes.bool,
  expanded: _react.PropTypes.bool,
  onExpandChange: _react.PropTypes.func
};