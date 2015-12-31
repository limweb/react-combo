'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _reactField = require('react-field');

var _reactField2 = _interopRequireDefault(_reactField);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _getSelectionStart2 = require('./getSelectionStart');

var _getSelectionStart3 = _interopRequireDefault(_getSelectionStart2);

var _getSelectionEnd2 = require('./getSelectionEnd');

var _getSelectionEnd3 = _interopRequireDefault(_getSelectionEnd2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderField = function renderField(props) {
  var _this = this;

  var fieldProps = (0, _objectAssign2.default)({}, props.fieldProps, {
    value: props.text,
    tabIndex: -1,
    ref: function ref(f) {
      return _this.field = f;
    },

    onFocus: this.onFieldFocus,
    onBlur: this.onFieldBlur,
    onKeyDown: this.onFieldKeyDown,
    onChange: this.onFieldChange
  });

  if (props.dropdown) {
    // fieldProps.readOnly = true
  }

  fieldProps.className = (0, _join2.default)(fieldProps.className, 'react-combo__field');

  if (props.onRenderField) {
    fieldProps = props.onRenderField(fieldProps);
  }

  var field = undefined;

  if (props.renderField) {
    field = props.renderField(fieldProps);
  }

  if (field === undefined) {
    field = _react2.default.createElement(_reactField2.default, fieldProps);
  }

  return field;
};

var onFieldFocus = function onFieldFocus(event) {

  this.setState({
    focused: true
  });

  if (this.state.focused) {
    return;
  }

  if (this.props.expandOnFocus && !this.state.expanded) {
    this.toggleList();
  }

  this.props.onFocus(event);
};

var onFieldBlur = function onFieldBlur(event) {
  var _this2 = this;

  this.setState({
    focused: false
  }, function () {
    if (_this2.state.focused) {
      return;
    }

    _this2.setState({
      activeTagIndex: -1
    });

    _this2.props.forceSelect && _this2.setText('');
    _this2.onBlur(event);

    if (_this2.state.expanded) {
      _this2.toggleList();
    }
  });
};

var onFieldKeyDown = function onFieldKeyDown(event) {

  var key = event.key;
  var arrowDown = key === 'ArrowDown';
  var arrowUp = key === 'ArrowUp';
  var arrow = arrowUp || arrowDown;
  var props = this.p;

  if (this.props.dropdown && arrow) {
    event.preventDefault();
  }

  if (!this.state.expanded && arrow) {
    return this.toggleList();
  }

  arrowDown && this.navigate(1);
  arrowUp && this.navigate(-1);

  if (event.key == 'Enter') {
    this.selectAt(this.p.currentIndex);

    if (props.multiSelect) {
      props.gotoNextOnSelect && this.navigate(1); //go to next item
    } else {
        this.props.forceSelect && this.setText('');
        this.toggleList();
      }
  }

  if (event.key == 'Escape' && this.state.expanded) {
    return this.toggleList();
  }

  //now deal with navigation between tags

  if (key != 'Backspace' && key != 'ArrowLeft' && key != 'ArrowRight' && key != 'Delete') {
    return;
  }

  var text = props.text + '';
  var tags = props.value;

  var selectionStart = this.getSelectionStart();
  var selectionEnd = this.getSelectionEnd();

  if (selectionStart < selectionEnd) {
    return;
  }

  var textToLeft = undefined;
  var textToRight = undefined;
  var index = props.activeTagIndex;

  if (key == 'ArrowLeft' || key == 'Backspace') {
    textToLeft = text.substring(0, selectionStart);
  }
  if (key == 'ArrowRight' || key == 'Delete') {
    textToRight = text.substring(selectionEnd);
  }

  if ((key == 'Backspace' || key == 'ArrowLeft') && textToLeft === '') {
    //if there is no other character at the left of the cursor
    //go to the tag before the cursor
    if (index == -1) {
      index = tags.length;
    }

    index--;

    if (index >= 0) {
      this.setActiveTag(index);
      event.preventDefault();
    }
  }

  if ((key == 'ArrowRight' || key == 'Delete') && index == -1 && textToRight == '' && tags.length) {
    this.setActiveTag(index + 1);
    event.preventDefault();
  }
};

var navigate = function navigate(dir) {

  dir = dir < 0 ? -1 : 1;

  var currentIndex = this.p.currentIndex;

  var newCurrentIndex = undefined;

  if (currentIndex == null) {
    newCurrentIndex = 0;
  } else {
    newCurrentIndex = (0, _clamp2.default)(currentIndex + dir, 0, this.p.data.length - 1);
  }

  this.props.onNavigate(newCurrentIndex);

  if (this.props.currentIndex == null) {
    this.setState({
      currentIndex: newCurrentIndex
    });
  }
};

var onFieldChange = function onFieldChange(value) {

  if (!this.state.expanded) {
    this.toggleList();
  }

  this.setText(value);
};

var toggleList = function toggleList() {
  this.onExpandChange(!this.state.expanded);
};

var renderHiddenField = function renderHiddenField(props) {
  var _this3 = this;

  // if (!props.multiSelect){
  //   return null
  // }

  return _react2.default.createElement('input', {
    tabIndex: -1,
    ref: function ref(f) {
      return _this3.hiddenField = f;
    },
    key: 'hiddenFocusField',
    type: 'text',
    className: 'react-combo__hidden-field',
    onFocus: this.onHiddenFieldFocus,
    onBlur: this.onHiddenFieldBlur,
    onKeyDown: this.onHiddenFieldKeyDown
  });
};

var onHiddenFieldFocus = function onHiddenFieldFocus() {
  var props = this.p;

  this.setState({
    focused: true
  });
};

var onHiddenFieldBlur = function onHiddenFieldBlur(event) {
  this.onFieldBlur(event);
};

var onHiddenFieldKeyDown = function onHiddenFieldKeyDown(event) {
  var props = this.p;
  var key = event.key;
  var index = props.activeTagIndex;
  var tags = props.value;

  var dir = 0;

  if (key == 'ArrowUp' || key == 'ArrowDown' || key == ' ') {
    event.preventDefault();
    return;
  }

  if (key == 'Escape') {
    event.preventDefault();
    this.setActiveTag(-1);
    return;
  }

  if (key == 'ArrowLeft') {
    dir = -1;
  }
  if (key == 'ArrowRight') {
    dir = 1;
  }

  if (dir) {

    if ((0, _clamp2.default)(index + dir, 0, tags.length - 1) == index + dir) {
      index += dir;
    } else {
      index = -1;
    }

    this.setActiveTag(index);

    event.preventDefault();

    return;
  }

  if (key == 'Backspace' || key == 'Delete') {
    this.removeAt(index, key == 'Backspace' ? -1 : 0);
    event.preventDefault();
  }
};

exports.default = {
  renderField: renderField,
  onFieldFocus: onFieldFocus,
  onFieldBlur: onFieldBlur,
  onFieldKeyDown: onFieldKeyDown,
  onFieldChange: onFieldChange,
  toggleList: toggleList,
  navigate: navigate,
  renderHiddenField: renderHiddenField,
  onHiddenFieldFocus: onHiddenFieldFocus,
  onHiddenFieldBlur: onHiddenFieldBlur,
  onHiddenFieldKeyDown: onHiddenFieldKeyDown,
  getSelectionStart: function getSelectionStart() {
    return (0, _getSelectionStart3.default)((0, _reactDom.findDOMNode)(this.field));
  },
  getSelectionEnd: function getSelectionEnd() {
    return (0, _getSelectionEnd3.default)((0, _reactDom.findDOMNode)(this.field));
  }
};