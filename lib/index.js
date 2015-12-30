'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = undefined;

var _List = require('./List');

Object.defineProperty(exports, 'List', {
  enumerable: true,
  get: function get() {
    return _List.default;
  }
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactClass = require('react-class');

var _reactClass2 = _interopRequireDefault(_reactClass);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _reactField = require('react-field');

var _reactField2 = _interopRequireDefault(_reactField);

var _hasown = require('hasown');

var _hasown2 = _interopRequireDefault(_hasown);

var _reactInlineBlock = require('react-inline-block');

var _reactInlineBlock2 = _interopRequireDefault(_reactInlineBlock);

var _ExpandTool = require('./ExpandTool');

var _ExpandTool2 = _interopRequireDefault(_ExpandTool);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

var _fieldMethods = require('./fieldMethods');

var _fieldMethods2 = _interopRequireDefault(_fieldMethods);

var _listMethods = require('./listMethods');

var _listMethods2 = _interopRequireDefault(_listMethods);

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _List2 = _interopRequireDefault(_List);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Combo = (function (_Component) {
  _inherits(Combo, _Component);

  function Combo(props) {
    _classCallCheck(this, Combo);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Combo).call(this, props));

    _this.state = {
      focused: false,
      expanded: false,
      currentIndex: props.currentIndex,
      value: props.defaultValue,
      data: [],
      dataMap: {},
      filterValue: '',
      text: '',
      activeTagIndex: -1
    };
    return _this;
  }

  _createClass(Combo, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.onChangeProps(nextProps);
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.onChangeProps(this.props, { force: true });
    }
  }, {
    key: 'onChangeProps',
    value: function onChangeProps(props, config) {
      var _this2 = this;

      config = config || {};

      if (props.dataSource === this.props.dataSource && !config.force) {
        //the datasource has not changed as we assume
        //changes will be reflected by giving another instance - immutability into play
        return;
      }

      if (props.dataSource && !Array.isArray(props.dataSource) && props.dataSource.then) {
        //this is a promise

        props.dataSource.then(function (data) {
          _this2.setData(data);
          _this2.setState({
            loading: false
          });
        });

        this.setData([]);
        this.setState({
          loading: true
        });
      } else {
        this.setData(props.dataSource || []);
      }
    }
  }, {
    key: 'setText',
    value: function setText(value) {
      this.setState({
        text: value
      });

      this.filterList(value);
    }
  }, {
    key: 'filterList',
    value: function filterList(value) {
      if (value === '') {
        return this.setState({
          filterValue: '',
          filterData: undefined
        });
      }

      this.setState({
        filterValue: value,
        filterData: this.getFilteredData(value)
      });
    }
  }, {
    key: 'getFilteredData',
    value: function getFilteredData(value, data) {

      var props = this.p;

      if (value === undefined) {
        value = this.state.filterValue;
      }

      if (data === undefined) {
        data = this.state.data;
      }

      if (!value) {
        return data;
      }

      var filter = props.filter;

      return filter(value, data, props);
    }
  }, {
    key: 'getData',
    value: function getData() {
      return this.state.filterData || this.state.data;
    }
  }, {
    key: 'setData',
    value: function setData(data) {

      var props = this.p || this.props;

      var dataMap = data.reduce(function (acc, item) {
        acc[item[props.idProperty]] = item;
        return acc;
      }, {});

      var filterData = this.state.filterValue ? this.getFilteredData(this.state.filterValue, data) : undefined;

      this.setState({
        dataMap: dataMap,
        data: data,
        filterData: filterData
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.p = this.prepareProps(this.props);
      var expanded = this.state.expanded;

      var list = this.renderList(props);
      var tags = this.renderTags(props);
      var hidden = this.renderHiddenField(props);

      var loading = this.p.loading;

      return _react2.default.createElement(
        'div',
        _extends({}, props, {
          data: null,
          tabIndex: this.state.focused ? -1 : this.props.tabIndex || 0,
          onFocus: this.onFocus
        }),
        tags,
        hidden,
        _react2.default.createElement(_ExpandTool2.default, {
          onExpandChange: this.onExpandChange,
          focused: this.state.focused,
          expanded: expanded,
          loading: loading
        }),
        list
      );
    }
  }, {
    key: 'renderTags',
    value: function renderTags(props) {
      var field = this.renderField(props);

      var tags = [props.selectedItems.map(this.renderItemTag), field];

      return _react2.default.createElement('div', { className: 'react-combo__value-tags', children: tags });
    }
  }, {
    key: 'renderItemTag',
    value: function renderItemTag(item, index) {
      var props = this.p;

      var displayProperty = props.displayProperty;
      var idProperty = props.idProperty;

      var id = item[idProperty];
      var label = item[displayProperty];
      var active = index === props.activeTagIndex;

      var clearTool = props.tagClearTool === false || props.tagClearTool == null ? null : _react2.default.createElement(
        'div',
        {
          key: 'clearTool',
          onClick: this.removeAt.bind(this, index),
          className: 'react-combo__value-tag-clear' },
        props.tagClearTool
      );

      var tagProps = {
        key: id,
        onMouseDown: this.onTagMouseDown.bind(this, item, index),
        className: (0, _join2.default)('react-combo__value-tag', active ? 'react-combo__value-tag--active' : null),
        item: item,
        idProperty: idProperty,
        displayProperty: displayProperty,
        children: [clearTool, _react2.default.createElement(
          _reactInlineBlock2.default,
          { key: 'label', className: 'react-combo__value-tag-label' },
          label
        )]
      };

      var result = undefined;
      if (props.renderTag) {
        result = props.renderTag(tagProps);
      }

      if (result === undefined) {
        result = _react2.default.createElement('div', tagProps);
      }

      return result;
    }
  }, {
    key: 'onTagMouseDown',
    value: function onTagMouseDown(item, index, event) {
      event.preventDefault();

      this.setActiveTag(index);
    }
  }, {
    key: 'onExpandChange',
    value: function onExpandChange(value) {
      this.setState({
        expanded: value
      });

      this.props.onExpandChange(value);
    }
  }, {
    key: 'onFocus',
    value: function onFocus(event) {
      if (this.state.focused) {
        return;
      }

      if (event.target == (0, _reactDom.findDOMNode)(this.hiddenField)) {
        return;
      }

      // console.log('onfocus', new Date())
      // this.props.onFocus()

      this.focusField();
    }
  }, {
    key: 'onBlur',
    value: function onBlur() {
      this.props.onBlur();
    }
  }, {
    key: 'setActiveTag',
    value: function setActiveTag(index) {
      if (index < 0 || index >= this.p.value.length) {
        //out of range
        index = -1;
        this.focusField();
      } else {
        this.focusHiddenField();
      }

      this.setState({
        activeTagIndex: index
      });
    }
  }, {
    key: 'selectAt',
    value: function selectAt(index) {
      var props = this.p;
      var data = props.data;
      var item = data[index];

      if (!item) {
        return;
      }

      var selectedId = item[props.idProperty];

      var selectedMap = props.selectedMap;

      if ((0, _hasown2.default)(selectedMap, selectedId)) {
        //selection already exists
        return;
      }

      var value = props.multiSelect ? [].concat(_toConsumableArray(props.value), [selectedId]) : selectedId;

      var selected = props.multiSelect ? [].concat(_toConsumableArray(props.selectedItems), [item]) : item;

      props.onSelect(item, selected);

      props.onChange(value, item, selected, { add: item });

      if (this.props.value == null) {
        this.setState({
          value: value
        });
      }
    }
  }, {
    key: 'removeAt',
    value: function removeAt(index, dir) {

      if (dir == undefined) {
        dir = 0;
      }

      var props = this.p;
      var value = props.value;

      if ((0, _clamp2.default)(index, 0, value.length - 1) != index) {
        return;
      }

      var item = props.selectedMap[value[index]];

      var newValue = [].concat(_toConsumableArray(value.slice(0, index)), _toConsumableArray(value.slice(index + 1)));

      var dataMap = this.state.dataMap;
      var selected = newValue.map(function (id) {
        return dataMap[id];
      }).filter(function (x) {
        return !!x;
      });

      props.onChange(newValue, item, selected, { remove: item });

      if (this.props.value == null) {
        this.setState({
          value: newValue
        });
      }

      if (value.length && (index === value.length - 1 || index === 0)) {
        this.setActiveTag(index === value.length - 1 ? index - 1 : 0);
      } else {
        this.setActiveTag(index + dir);
      }
    }
  }, {
    key: 'prepareProps',
    value: function prepareProps(thisProps) {
      var props = (0, _objectAssign2.default)({}, thisProps);

      this.prepareListProps(props);

      this.prepareValue(props);

      props.activeTagIndex = this.state.activeTagIndex;
      props.text = this.state.text;
      props.focused = this.state.focused;
      props.expanded = this.state.expanded;

      var currentIndex = thisProps.currentIndex == null ? this.state.currentIndex : thisProps.currentIndex;

      if ((0, _clamp2.default)(currentIndex, 0, props.data.length - 1) != currentIndex) {
        currentIndex = null;
      }

      props.currentIndex = currentIndex;

      props.className = (0, _join2.default)('react-combo', props.className, 'react-combo--list-' + props.listPosition, props.focused && (0, _join2.default)(props.focusedClassName, 'react-combo--focused'), props.expanded && (0, _join2.default)(props.expandedClassName, 'react-combo--expanded'));

      return props;
    }
  }, {
    key: 'prepareValue',
    value: function prepareValue(props) {

      var value = props.value == null ? this.state.value : props.value;

      if (Array.isArray(value)) {
        props.multiSelect = true;
      }

      value = value != null && !Array.isArray(value) ? [value] : value;

      var dataMap = this.state.dataMap;
      var displayProperty = props.displayProperty;

      var selectedMap = {};
      var selectedItems = value.map(function (id) {
        var item = dataMap[id];
        if (item) {
          selectedMap[id] = item;
        }
        return item;
      }).filter(function (x) {
        return !!x;
      });

      props.selectedItems = selectedItems;
      props.selectedMap = selectedMap;
      props.value = value;
    }
  }, {
    key: 'prepareListProps',
    value: function prepareListProps(props) {
      var listChildren = _react2.default.Children.toArray(props.children).filter(function (c) {
        return c && c.props && c.props.isComboList;
      });
      var childList = listChildren[0];

      props.data = this.getData();
      props.loading = !!this.state.loading;

      if (childList) {
        props.data = childList.props.data || props.data;
        props.idProperty = childList.props.idProperty || props.idProperty;
        props.displayProperty = childList.props.displayProperty || props.displayProperty;
        props.listPosition = childList.props.listPosition || props.listPosition;
        props.renderItem = childList.props.renderItem || props.renderItem;
        props.childList = childList;
      }
    }
  }, {
    key: 'focusField',
    value: function focusField() {
      var input = (0, _reactDom.findDOMNode)(this.field);

      input.focus();
    }
  }, {
    key: 'focusHiddenField',
    value: function focusHiddenField() {
      if (!this.hiddenField) {
        return;
      }

      var input = (0, _reactDom.findDOMNode)(this.hiddenField);

      input.focus();
    }
  }]);

  return Combo;
})(_reactClass2.default);

exports.default = Combo;

(0, _objectAssign2.default)(Combo.prototype, _fieldMethods2.default, _listMethods2.default);

Combo.defaultProps = {
  onExpandChange: function onExpandChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},

  onNavigate: function onNavigate(index) {},
  onSelect: function onSelect(item, selectedItems) {},
  onChange: function onChange() {},

  onItemMouseDown: function onItemMouseDown(item, id, index) {},
  onItemMouseEnter: function onItemMouseEnter(item, id, index) {},

  filter: function filter(value, array, props) {
    var displayProperty = props.displayProperty;

    return array.filter(function (item) {
      return item[displayProperty].indexOf(value) != -1;
    });
  },

  forceSelect: true,
  tagClearTool: '⊗',

  expandOnFocus: true,
  dropdown: false,

  idProperty: 'id',
  displayProperty: 'label',
  disabledProperty: 'disabled',
  listPosition: 'bottom'
};