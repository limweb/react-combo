'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactClass = require('react-class');

var _reactClass2 = _interopRequireDefault(_reactClass);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _hasown = require('hasown');

var _hasown2 = _interopRequireDefault(_hasown);

var _join = require('../join');

var _join2 = _interopRequireDefault(_join);

var _Item = require('./Item');

var _Item2 = _interopRequireDefault(_Item);

var _scrollToRowIfNeeded = require('./scrollToRowIfNeeded');

var _scrollToRowIfNeeded2 = _interopRequireDefault(_scrollToRowIfNeeded);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var List = function (_Component) {
  _inherits(List, _Component);

  function List(props) {
    _classCallCheck(this, List);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(List).call(this, props));

    _this.state = {
      currentIndex: props.defaultCurrentIndex,
      direction: 0
    };
    return _this;
  }

  _createClass(List, [{
    key: 'toArray',
    value: function toArray(data) {
      return [].concat(_toConsumableArray(data));
    }
  }, {
    key: 'render',
    value: function render() {

      var props = this.p = (0, _objectAssign2.default)({}, this.props);

      props.currentIndex = props.currentIndex != null ? props.currentIndex : this.state.currentIndex;

      if (!this.props.visible) {
        return null;
      }

      var data = this.props.data;
      var listPosition = props.listPosition || 'bottom';

      var className = (0, _join2.default)(props.className, 'react-combo__list', 'react-combo__list--' + listPosition, props.loading && 'react-combo__list--loading', !data.length && 'react-combo__list--empty');

      return _react2.default.createElement(
        'ul',
        _extends({}, props, { data: null, className: className }),
        this.renderItems(data, listPosition),
        this.renderEmptyText(),
        this.renderLoadingText()
      );
    }
  }, {
    key: 'renderEmptyText',
    value: function renderEmptyText() {
      if (this.props.data.length || this.props.loading) {
        return null;
      }

      return this.props.emptyText;
    }
  }, {
    key: 'renderLoadingText',
    value: function renderLoadingText() {
      if (!this.props.loading) {
        return null;
      }

      return this.props.loadingText;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var props = this.props;
      var currentIndex = props.currentIndex;
      var listPosition = props.listPosition;

      // when list is expanded and currentIndex is not set, scroll bottom
      if (currentIndex == null && listPosition === 'top') {
        this.scrollBottom();
      }

      if (prevProps.currentIndex != currentIndex) {
        if (currentIndex != null) {
          var direction = currentIndex - (prevProps.currentIndex || 0) < 0 ? -1 : 1;

          this.scrollToRow(currentIndex, direction * this.getDirectionSign());
        }
      }
    }
  }, {
    key: 'scrollToRow',
    value: function scrollToRow(index, direction) {
      var el = this.refs['list-item-' + index];
      var row = (0, _reactDom.findDOMNode)(el);

      (0, _scrollToRowIfNeeded2.default)(row, direction);
    }
  }, {
    key: 'scrollBottom',
    value: function scrollBottom() {
      var domNode = (0, _reactDom.findDOMNode)(this);

      if (domNode) {
        domNode.scrollTop = domNode.offsetHeight;
      }
    }
  }, {
    key: 'renderItems',
    value: function renderItems(data, listPosition) {
      var _this2 = this;

      if (listPosition === 'bottom') {
        return data.map(this.renderItem);
      }

      if (listPosition === 'top') {
        return data.reduceRight(function (acc, item, index) {
          acc.push(_this2.renderItem(item, index));

          return acc;
        }, []);
      }
    }
  }, {
    key: 'renderItem',
    value: function renderItem(item, index) {
      var getItemId = this.props.getItemId;
      var getItemLabel = this.props.getItemLabel;
      var id = getItemId(item);
      var selected = (0, _hasown2.default)(this.props.selectedMap, id);

      var itemProps = {
        key: id,
        data: item,
        selected: selected,
        current: index === this.p.currentIndex,
        children: getItemLabel(item),

        idProperty: this.props.idProperty,
        displayProperty: this.props.displayProperty,

        getItemId: this.props.getItemId.bind(this),
        getItemLabel: this.props.getItemLabel.bind(this),

        onMouseDown: this.onItemMouseDown.bind(this, item, id, index),
        onMouseEnter: this.onItemMouseEnter.bind(this, item, id, index),

        renderItem: this.props.renderItem
      };

      return _react2.default.createElement(_Item2.default, _extends({ ref: 'list-item-' + index }, itemProps));
    }
  }, {
    key: 'onItemMouseDown',
    value: function onItemMouseDown(item, id, index, event) {
      this.props.onItemMouseDown(item, id, index, event);
    }
  }, {
    key: 'onItemMouseEnter',
    value: function onItemMouseEnter(item, id, index, event) {
      this.props.onItemMouseEnter(item, id, index, event);
    }
  }, {
    key: 'getDirectionSign',
    value: function getDirectionSign() {
      return this.p.listPosition === 'bottom' ? 1 : -1;
    }
  }]);

  return List;
}(_reactClass2.default);

exports.default = List;


List.defaultProps = {
  isComboList: true,

  onItemMouseDown: function onItemMouseDown() {},
  onItemMouseEnter: function onItemMouseEnter() {},

  emptyText: 'Nothing to display.',
  loadingText: 'Loading...'
};

List.propTypes = {
  idProperty: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  displayProperty: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  disabledProperty: _react.PropTypes.string,
  visible: _react.PropTypes.bool,
  data: _react.PropTypes.array,
  emptyText: _react.PropTypes.node,
  loadingText: _react.PropTypes.node
};