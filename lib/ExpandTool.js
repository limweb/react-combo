'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactClass = require('react-class');

var _reactClass2 = _interopRequireDefault(_reactClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DOWN = '▼';
var UP = '▲';

var ExpandTool = (function (_Component) {
  _inherits(ExpandTool, _Component);

  function ExpandTool() {
    _classCallCheck(this, ExpandTool);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ExpandTool).apply(this, arguments));
  }

  _createClass(ExpandTool, [{
    key: 'render',
    value: function render() {
      var props = this.props;

      return _react2.default.createElement(
        'div',
        _extends({}, props, {
          className: 'react-combo__expand-tool',
          onMouseDown: this.onMouseDown
        }),
        props.expanded ? UP : DOWN
      );
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
})(_reactClass2.default);

exports.default = ExpandTool;

ExpandTool.propTypes = {
  focused: _react.PropTypes.bool,
  expanded: _react.PropTypes.bool,
  onExpandChange: _react.PropTypes.func
};