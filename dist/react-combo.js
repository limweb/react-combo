(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["ReactCombo"] = factory(require("React"));
	else
		root["ReactCombo"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(7)
	var Field  = __webpack_require__(8)

	var ListView        = __webpack_require__(9)
	var ListViewFactory = React.createFactory(ListView)

	var arrowStyle   = __webpack_require__(2)
	var toUpperFirst = __webpack_require__(3)
	var findIndexBy  = __webpack_require__(4)
	var FILTER_BY    = __webpack_require__(5)

	function emptyFn(){}

	var stringOrNumber = React.PropTypes.oneOfType([
	    React.PropTypes.string,
	    React.PropTypes.number
	])

	module.exports = React.createClass({

	    displayName: 'ReactCombo',

	    mixins: [
	        __webpack_require__(6)
	    ],

	    propTypes: {

	        arrowColor: React.PropTypes.string,
	        arrowOverColor: React.PropTypes.string,

	        arrowSize   : React.PropTypes.number,
	        arrowHeight : React.PropTypes.number,
	        arrowWidth  : React.PropTypes.number,
	        arrowPadding: React.PropTypes.number,

	        showListOnFocus: React.PropTypes.bool,
	        stateful       : React.PropTypes.bool,
	        clearTool      : React.PropTypes.bool,
	        readOnly       : React.PropTypes.bool,
	        forceSelect    : React.PropTypes.bool,

	        listStyle : React.PropTypes.object,
	        listProps : React.PropTypes.object,

	        fieldStyle: React.PropTypes.object,
	        fieldProps: React.PropTypes.object,

	        filterFn: React.PropTypes.func,
	        value: React.PropTypes.any,
	        defaultValue: React.PropTypes.any,
	        displayValue: stringOrNumber,

	        //if you want to have the id property in the DOM, in a hidden input,
	        //you can specify a string value for this property
	        //and a hidden input will be rendered
	        hiddenName: React.PropTypes.string,

	        idProperty: React.PropTypes.string,
	        displayProperty: React.PropTypes.string,
	        placeholder: React.PropTypes.string,

	        data: function(props, propName){
	            var value = props[propName]

	            if (value){
	                if (!Array.isArray(value) && typeof value.then != 'function'){
	                    return new Error('data property needs to be an array or a promise!')
	                }
	            }
	        },

	        onSelect: React.PropTypes.func,
	        onChange: React.PropTypes.func,
	        onFilter: React.PropTypes.func,
	        validate: React.PropTypes.func,

	        listFactory  : React.PropTypes.func,
	        onShowList   : React.PropTypes.func,
	        renderList   : React.PropTypes.func,
	        constrainList: React.PropTypes.func
	    },

	    filterBy: FILTER_BY,

	    getInitialState: function(){
	        return {
	            listVisible             : false,
	            selectedId              : undefined,
	            lastSelectedId          : undefined,
	            lastSelectedDisplayValue: undefined,
	            filterValue             : undefined
	        }
	    },

	    getDefaultProps: function(){
	        return {
	            defaultStyle: {
	                position: 'relative'
	            },
	            arrowColor: '#a8a8a8',
	            arrowOverColor: '#7F7C7C',
	            arrowWidth: 5,
	            arrowHeight: 8,
	            arrowPadding: 4,
	            showListOnFocus  : true,
	            stateful: true,
	            loading : false,
	            listPosition: 'bottom',
	            hiddenName: '',
	            constrainTo: true,
	            forceSelect: false,
	            updateOnNavigate: false
	        }
	    },

	    isStatefulFiltering: function(props) {
	        return props.stateful
	    },

	    render: function(){

	        var props = this.prepareProps(this.props, this.state)

	        return this.renderWith(props, this.state)
	    },

	    renderWith: function(props, state){

	        var list = this.renderList(props, state)
	        var hiddenField = props.hiddenName?
	                            React.createElement("input", {type: "hidden", value: this.getValue(props, state), name: props.hiddenName}):
	                            null

	        return React.createElement("div", React.__spread({},  this.prepareDivProps(props, state)), 
	            hiddenField, 
	            React.createElement(Field, React.__spread({},  props.fieldProps)), 
	            list
	        )
	    },

	    renderList: function(props, state){
	        var listProps = props.listProps
	        var visible   = state.listVisible

	        if (!visible){
	            listProps.style.display = 'none'
	        }

	        if (visible){
	            ;(props.onShowList || emptyFn)(listProps)

	            if (props.constrainTo){
	                this.constrainList(props, listProps, props.constrainTo)
	            }
	        }

	        var list = (props.listFactory || ListViewFactory)(listProps)

	        if (typeof props.renderList === 'function'){
	            return props.renderList(list)
	        }

	        return list
	    },

	    getSelectedId: function(props, state){
	        return state.selectedId === undefined?
	                                props.selectedId:
	                                state.selectedId

	    },

	    prepareSelected: function(props, state) {
	        var selectedId = this.getSelectedId(props, state)
	        var selected

	        if (selectedId !== undefined){

	            selected = {}
	            selected[selectedId] = true
	        }

	        return selected
	    },

	    prepareListProps: function(props, state){
	        var listProps  = assign({}, props.listProps)
	        var data       = props.data || listProps.data

	        var idProperty      = props.idProperty || listProps.idProperty
	        var displayProperty = props.displayProperty || listProps.displayProperty

	        listProps.loading         = typeof listProps.loading != 'undefined'? listProps.loading: props.loading
	        listProps.idProperty      = idProperty
	        listProps.displayProperty = displayProperty
	        listProps.onRowMouseDown  = this.handleListRowMouseDown.bind(this, props)

	        listProps.style = assign({}, props.listStyle, listProps.style)

	        listProps.rowStyle = assign({
	            cursor: 'pointer'
	        }, listProps.rowStyle)

	        listProps.ref = "list"

	        return listProps
	    },

	    prepareDivProps: function(props, state){

	        var divProps = assign({}, props)

	        delete divProps.data
	        delete divProps.value
	        delete divProps.placeholder

	        divProps['data-value'] = this.getValue(props, state)

	        return divProps
	    },

	    prepareFieldProps: function(props){
	        var fieldProps = assign({}, props, props.fieldProps)

	        delete fieldProps.fieldProps
	        delete fieldProps.style
	        delete fieldProps.defaultStyle
	        delete fieldProps.readOnly

	        if (props.readOnly){
	            fieldProps.inputProps = assign({}, fieldProps.inputProps)
	            fieldProps.inputProps.style = assign({
	                cursor: 'pointer'
	            }, fieldProps.inputProps.style)
	        }

	        fieldProps.ref = 'field'

	        fieldProps.style       = assign({}, props.fieldStyle, fieldProps.style)
	        fieldProps.onFocus     = this.handleFocus
	        fieldProps.onBlur      = this.handleBlur
	        fieldProps.onKeyDown   = this.handleKeyDown.bind(this, props)
	        fieldProps.onChange    = this.handleChange.bind(this, props)

	        delete fieldProps.data

	        return fieldProps
	    },

	    prepareData: function(props, state){
	        var listProps       = props.listProps
	        var displayProperty = listProps.displayProperty

	        var data    = state.data || props.data || listProps.data
	        var isArray = Array.isArray(data)

	        if (isArray && this.isStatefulFiltering(props) && state.filterValue != null && state.filterValue !== ''){
	            data = (props.filterFn || this.filterBy)(state.filterValue, data, displayProperty) || data
	        }

	        if (!isArray && typeof data.then === 'function'){

	            listProps.loading = true

	            data.then(function(arr){
	                this.setState({
	                    loading: false,
	                    data   : arr
	                })
	            }.bind(this))
	        }

	        if (state.data){
	            listProps.loading = false
	        }

	        if (!Array.isArray(data)){
	            data = []
	        }

	        return data
	    },

	    getValue: function(props, state){
	        var theValue = props.value === undefined?
	                            state.value === undefined?
	                                props.defaultValue:
	                                state.value
	                            :
	                            props.value

	        return theValue
	    },

	    prepareProps: function(thisProps, state){
	        var props = {}

	        assign(props, thisProps)

	        //----- prepare tools
	        props.tools = props.tools || this.renderTools

	        //----- listProps
	        var listProps = props.listProps  = this.prepareListProps(props, state)

	        props.data = props.listProps.data = this.prepareData(props, state)

	        //------- fieldProps
	        var fieldProps = props.fieldProps = this.prepareFieldProps(props, state)

	        var theValue     = this.getValue(props, state)
	        var displayValue = props.displayValue
	        var index        = this.getIndexForValue(theValue, props)

	        if (typeof displayValue == 'undefined'){
	            displayValue = this.getDisplayPropertyAt(index, props) || theValue
	        }

	        if (props.forceSelect && this.isMounted() && !this.isFocused() && !~index){
	            displayValue = typeof state.lastSelectedDisplayValue === 'undefined'?
	                                this.lastSelectedDisplayValue:
	                                state.lastSelectedDisplayValue
	        }


	        //------ props.selectedId
	        props.selectedId = this.getIdPropertyAt(index, props)

	        //------ listProps.selected
	        var selected  = this.prepareSelected(props, state)

	        if (selected){
	            listProps.selected = selected
	        }

	        var selectedId = this.getSelectedId(props, state)
	        var selectedIndex

	        if (selectedId){
	            if (props.forceSelect && typeof state.lastSelectedDisplayValue === 'undefined'){
	                selectedIndex = this.getIndexForValue(selectedId, props)
	                this.lastSelectedDisplayValue = this.getDisplayPropertyAt(selectedIndex, props)
	            }

	            setTimeout(function(){
	                this.scrollToRowById(selectedId)
	            }.bind(this))
	        }

	        fieldProps.value = displayValue

	        props.displayValue = displayValue

	        props.className = this.prepareClassName(props)
	        props.style     = this.prepareStyle(props)

	        return props
	    },

	    scrollToRowById: function(id){
	        if (this.state.listVisible && this.isMounted()){
	            this.refs.list.scrollToRowById(id)
	        }
	    },

	    prepareClassName: function(props){
	        var className = props.className || ''

	        className += ' z-combo'

	        if (props.readOnly){
	            className += ' z-read-only'
	        }

	        if (props.displayValue === ''){
	            className += ' z-empty'
	        }

	        return className
	    },

	    prepareStyle: function (props) {
	        var style = assign({}, props.defaultStyle, props.style)

	        return style
	    },

	    getData: function(props){
	        return props.listProps.data
	    },

	    getIndexForValue: function(value, props, data){
	        var listProps       = props.listProps
	        var idProperty      = listProps.idProperty

	        data = data || listProps.data

	        return findIndexBy(function(item){
	            if (item && item[idProperty] === value){
	                return true
	            }
	        }, data)
	    },

	    getIndexOf: function(value, props, data){
	        var listProps       = props.listProps
	        var idProperty      = listProps.idProperty
	        var displayProperty = listProps.displayProperty

	        data = data || listProps.data

	        return findIndexBy(function(item){
	            if (item && (item[idProperty] === value || item[displayProperty] === value)){
	                return true
	            }
	        }, data)
	    },

	    getItemAt: function(index, props, data){
	        return (data || props.listProps.data)[index]
	    },

	    getDisplayPropertyAt: function(index, props, data){
	        var result = this.getPropertyAt(props.listProps.displayProperty, index, props, data)

	        return typeof result != 'undefined'?
	                    result:
	                    ''
	    },

	    getIdPropertyAt: function(index, props, data){
	        return this.getPropertyAt(props.listProps.idProperty, index, props, data)
	    },

	    getPropertyAt: function(propertyName, index, props, data){
	        var item = this.getItemAt(index, props, data)

	        return item?
	                item[propertyName]:
	                undefined
	    },

	    getDisplayValueForValue: function(value, props, data){
	        var displayProperty = props.listProps.displayProperty
	        var index           = this.getIndexForValue(value, props, data)

	        data = data || props.listProps.data

	        if (~index){
	            return data[index][displayProperty]
	        }
	    },

	    renderTools: function(props, clearTool){
	        return [
	            clearTool,
	            this.renderComboTool(props)
	        ]
	    },

	    renderComboTool: function(props){

	        var state        = this.state
	        var arrowProps   = assign(props)
	        var arrowPadding = props.arrowPadding

	        var style = {
	            padding : '0px ' + arrowPadding + 'px',
	            height  : '100%',
	            position: 'relative',
	            display : 'flex',
	            flexFlow: 'column',
	            cursor  : 'pointer'
	        }

	        var className = 'combo-tool'

	        if (state && state.arrowToolOver){
	            className += ' combo-tool-over'
	            arrowProps.arrowColor = props.arrowOverColor || arrowProps.arrowColor
	        }

	        var comboArrowStyle = arrowStyle('down', arrowProps)

	        return React.createElement("div", {style: style, 
	                className: className, 
	                onMouseOut: this.handleArrowMouseOut, 
	                onMouseOver: this.handleArrowMouseOver, 
	                onClick: this.handleArrowClick, 
	                onMouseDown: this.handleArrowMouseDown}, 
	            React.createElement("div", {className: "combo-arrow", style: comboArrowStyle})
	        )
	    },

	    handleChange: function(props, value, inputProps, event){

	        var state = this.state
	        var data  = this.getData(props)
	        var index = this.getIndexForValue(value, props)

	        var filterValue = state.filterValue

	        if (event && event.type == 'input' || value === ''){
	            filterValue = value
	        }

	        if (props.readOnly){
	            filterValue = null
	        }

	        if (data && data.length === 1){
	            //if there is only one option left and the filter equals
	            //the display value of the single item
	            //we select the value
	            if (value === this.getDisplayPropertyAt(0, props)){
	                index = 0
	            }
	        }

	        var selectedId = this.getIdPropertyAt(index, props)

	        this.setState({
	            selectedId : selectedId
	        })

	        this.setListVisible(true)

	        var item
	        var data
	        var info = {
	            event: event
	        }

	        var text = value

	        if (~index){
	            data          = props.listProps.data
	            item          = data[index]
	            info.selected = item
	            info.index    = index
	            info.id       = selectedId
	            value         = selectedId
	            text          = this.getDisplayPropertyAt(index, props)
	        }

	        if (!props.readOnly || ~index){
	            this.onChange(props, text, value, info)
	        }

	        if (~index){
	            this.onSelect(props, text, selectedId, item, index)
	        }

	        this.doFilter(filterValue)
	    },

	    onChange: function(props, text, value, info){
	        if (typeof props.value === 'undefined'){
	            this.setState({
	                value: value
	            })
	        }

	        ;(this.props.onChange || emptyFn)(text, value, info);
	    },

	    onSelect: function(props, text, id, item, index) {
	        ;(this.props.onSelect || emptyFn)(text, id, item, index)

	        if (props.forceSelect){

	            this.setState({
	                lastSelectedId: id,
	                lastSelectedDisplayValue: text
	            })
	        }
	    },

	    doFilter: function(filterValue){
	        if (this.state.filterValue !== filterValue){
	            this.setState({
	                filterValue: filterValue
	            })

	            ;(this.props.onFilter || emptyFn)(filterValue)
	        }
	    },

	    confirm: function(props, index) {
	        if (this.isListVisible()){
	            if (typeof index === 'undefined'){
	                index = this.getIndexForValue(this.state.selectedId, props)
	            }

	            var data = props.listProps.data
	            var item = data[index]
	            var displayProperty = props.listProps.displayProperty
	            var idProperty      = props.listProps.idProperty

	            var text = ''
	            var id

	            if (item){
	                text = item[displayProperty]
	                id   = item[idProperty]
	            }

	            this.selectId(id)

	            this.setListVisible(false)
	        }
	    },

	    onArrowNavigation: function(props, dir){

	        this.setListVisible(true)

	        var newSelectedId
	        var listVisible = this.isListVisible()

	        if (listVisible){

	            var state = this.state

	            var selectedId    = this.getSelectedId(props, state)
	            var selectedIndex = this.getIndexForValue(selectedId, props)

	            var nextIndex     = selectedIndex + dir
	            var data          = props.listProps.data

	            if (nextIndex >= data.length){
	                nextIndex = 0
	            }
	            if (nextIndex < 0){
	                nextIndex = data.length - 1
	            }

	            newSelectedId = this.getIdPropertyAt(nextIndex, props)
	        } else {
	            newSelectedId = props.selectedId
	        }

	        if (props.updateOnNavigate){
	            this.selectId(newSelectedId)
	        } else {
	            this.setState({
	                selectedId: newSelectedId
	            })
	        }

	        if (!listVisible){
	            this.doFilter(null)
	        }
	    },

	    handleArrowMouseOver: function(){
	        this.setState({
	            arrowToolOver: true
	        })
	    },

	    handleArrowMouseOut: function(){
	        this.setState({
	            arrowToolOver: false
	        })
	    },

	    handleArrowClick: function(){
	        this.toggleList()
	    },

	    handleArrowMouseDown: function(event){
	        event.preventDefault()
	    },

	    handleKeyDown: function(props, event){
	        var key = event.key
	        var fn  = 'handle' + toUpperFirst(key) + 'KeyDown'

	        if (this[fn]){
	            this[fn](props, event)
	        }
	    },

	    handleListRowMouseDown: function(props, item, index, listProps, event) {
	        event.preventDefault()

	        this.confirm(props, index)
	    },

	    handleEnterKeyDown: function(props, event){
	        this.confirm(props)
	    },

	    handleEscapeKeyDown: function(props, event){
	        this.setListVisible(false)
	    },

	    handleArrowDownKeyDown: function(props, event){
	        this.onArrowNavigation(props, 1)
	    },

	    handleArrowUpKeyDown: function(props, event){
	        this.onArrowNavigation(props, -1)
	    },

	    isListVisible: function(){
	        return this.state.listVisible
	    },

	    setListVisible: function(value){
	        if (value != this.isListVisible()){
	            this.setState({
	                listVisible: value
	            })
	        }
	    },

	    toggleList: function(){
	        this.setState({
	            listVisible: !this.state.listVisible
	        })
	    },

	    isFocused: function(){
	        return this.refs.field.isFocused()
	    },

	    getInput: function(){
	        return this.refs.field?
	                    this.refs.field.getInput():
	                    null
	    },

	    focus: function(){
	        this.refs.field.focus()
	    },

	    notify: function(value, event) {
	        this.refs.field.notify(value, event)
	    },

	    selectId: function(id){
	        this.notify(id)
	    },

	    handleFocus: function(){
	        if (this.props.showListOnFocus){
	            this.setListVisible(true)
	            this.doFilter(null)
	        }
	    },

	    handleBlur: function() {

	        var props = this.props
	        var state = this.state

	        if (props.forceSelect){

	            var id    = state.lastSelectedId
	            var value = this.getValue(props, state)

	            if (id !== value){
	                this.selectId(id)
	            }
	        }

	        this.setState({
	            listVisible: false
	        })
	    }
	})

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function toUpperFirst(str){
	    if (!str){
	        return str
	    }

	    return str.charAt(0).toUpperCase() + str.substring(1)
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'


	module.exports = function findIndexBy(fn, data){

	    var i   = 0
	    var len = data.length
	    var it

	    var displayValue

	    for (; i < len; i++ ){
	        if (fn(data[i], i, data) === true){
	            return i
	        }
	    }

	    return -1
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(value, arr, displayProperty) {

	    value = (value + '').toLowerCase()

	    return arr.filter(function(item){
	        var prop = (item[displayProperty] + '').toLowerCase()

	        return prop.indexOf(value) === 0
	    })
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	    constrainList: __webpack_require__(10)
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var assign = __webpack_require__(17)
	var React  = __webpack_require__(1)

	function emptyFn() {}

	var TOOL_STYLES = {
	    true : {display: 'inline-block'},
	    false: {cursor: 'text', color: 'transparent'}
	}

	var INDEX = 0

	var DESCRIPTOR = {

	    displayName: 'ReactInputField',

	    propTypes: {
	        validate : React.PropTypes.func,
	        isEmpty  : React.PropTypes.func,
	        clearTool: React.PropTypes.bool
	    },

	    getDefaultProps: function () {
	        return {
	            focusOnClick: true,

	            defaultClearToolStyle: {
	                fontSize   : 20,
	                marginRight: 5,
	                marginLeft : 5,

	                alignSelf  : 'center',
	                cursor     : 'pointer',
	                userSelect : 'none',
	                boxSizing: 'border-box'
	            },
	            clearToolColor    : '#a8a8a8',
	            clearToolOverColor: '#7F7C7C',
	            defaultStyle: {
	                display   : 'inline-flex',
	                flexFlow  : 'row',
	                alignItems: 'stretch',
	                border    : '1px solid #a8a8a8',
	                boxSizing : 'border-box',
	                height    : 30
	            },

	            defaultInvalidStyle: {
	                border : '1px solid rgb(248, 144, 144)'
	            },

	            defaultInputStyle: {
	                flex   : 1,
	                border : 0,
	                height : '100%',
	                padding: '6px 2px',
	                outline: 'none',
	                boxSizing: 'border-box'
	            },

	            defaultInputInvalidStyle: {

	            },

	            emptyValue: '',
	            inputClassName: '',
	            inputProps    : null,

	            clearTool: true,

	            defaultClassName: 'z-field',
	            emptyClassName  : 'z-empty-value',
	            invalidClassName: 'z-invalid',

	            toolsPosition: 'right'
	        }
	    },

	    render: function() {

	        if (this.valid === undefined){
	            this.valid = true
	        }

	        var props = this.prepareProps(this.props)

	        if (this.valid !== props.valid && typeof props.onValidityChange === 'function'){
	            setTimeout(function(){
	                props.onValidityChange(props.valid, props.value, props)
	            }, 0)
	        }

	        this.valid = props.valid

	        props.children = this.renderChildren(props, this.state)

	        // delete props.value

	        var divProps = assign({}, props)
	        delete divProps.value
	        delete divProps.placeholder

	        return React.createElement("div", React.__spread({},  divProps))
	    },

	    renderChildren: function(props, state){
	        var field = this.renderField(props, state)
	        var tools = this.renderTools(props, state)

	        var children = [field]

	        if (props.toolsPosition == 'after' || props.toolsPosition == 'right'){
	            children.push.apply(children, tools)
	        } else {
	            children = (tools || []).concat(field)
	        }

	        return children
	    },

	    renderField: function(props) {
	        var inputProps = this.prepareInputProps(props)

	        inputProps.ref = 'input'

	        if (props.inputFactory){
	            return props.inputFactory(inputProps, props)
	        }

	        return React.createElement("input", React.__spread({},  inputProps))
	    },

	    renderTools: function(props, state) {

	        var clearTool = this.renderClearTool(props, state)
	        var result    = [clearTool]

	        if (typeof props.tools === 'function'){
	            result = props.tools(props, clearTool)
	        }

	        return result
	    },

	    renderClearTool: function(props, state) {

	        if (!props.clearTool){
	            return
	        }

	        var visible         = !this.isEmpty(props)
	        var visibilityStyle = TOOL_STYLES[visible]
	        var style           = assign({}, visibilityStyle, this.prepareClearToolStyle(props, state))

	        if (!visible){
	            assign(style, visibilityStyle)
	        }

	        return React.createElement("div", {
	            className: "z-clear-tool", 
	            onClick: this.handleClearToolClick, 
	            onMouseDown: this.handleClearToolMouseDown, 
	            onMouseOver: this.handleClearToolOver, 
	            onMouseOut: this.handleClearToolOut, 
	            style: style
	        }, "✖")
	    },

	    handleClearToolMouseDown: function(event) {
	        event.preventDefault()
	        console.log('clear')
	    },

	    handleClearToolOver: function(){
	        this.setState({
	            clearToolOver: true
	        })
	    },

	    handleClearToolOut: function(){
	        this.setState({
	            clearToolOver: false
	        })
	    },

	    isEmpty: function(props) {
	        var emptyValue = this.getEmptyValue(props)

	        if (typeof props.isEmpty === 'function'){
	            return props.isEmpty(props, emptyValue)
	        }

	        return props.value + '' === emptyValue + ''
	    },

	    getEmptyValue: function(props){
	        var value = props.emptyValue

	        if (typeof value === 'function'){
	            value = value(props)
	        }

	        return value
	    },

	    isValid: function(props) {
	        var value = props.value
	        var result = true

	        if (typeof props.validate === 'function'){
	            result = props.validate(value, props) !== false
	        }

	        return result
	    },

	    getInput: function() {
	        return this.refs.input.getDOMNode()
	    },

	    focus: function(){
	        var input = this.getInput()

	        if (input && typeof input.focus === 'function'){
	            input.focus()
	        }
	    },

	    handleClick: function(event){
	        if (this.props.focusOnClick && !this.isFocused()){
	            this.focus()
	        }
	    },

	    handleMouseDown: function(event) {
	        ;(this.props.onMouseDown || emptyFn)(event)
	        // event.preventDefault()
	    },

	    handleClearToolClick: function(event) {
	        this.notify(this.getEmptyValue(this.props), event)
	    },

	    handleChange: function(event) {
	        event.stopPropagation()
	        this.notify(event.target.value, event)
	    },

	    handleSelect: function(event) {
	        event.stopPropagation()
	        ;(this.props.onSelect || emptyFn)(event)
	    },

	    notify: function(value, event) {
	        ;(this.props.onChange || emptyFn)(value, this.props, event)
	    },

	    //*****************//
	    // PREPARE METHODS //
	    //*****************//
	    prepareProps: function(thisProps) {

	        var props = {}

	        assign(props, thisProps)

	        props.valid = this.isValid(props)
	        props.onClick = this.handleClick
	        props.onMouseDown = this.handleMouseDown

	        props.className = this.prepareClassName(props)
	        props.style = this.prepareStyle(props)

	        return props
	    },

	    prepareClassName: function(props) {
	        var result = [props.className, props.defaultClassName]

	        if (this.isEmpty(props)){
	            result.push(props.emptyClassName)
	        }

	        if (!props.valid){
	            result.push(props.invalidClassName)
	        }

	        return result.join(' ')
	    },

	    prepareStyle: function(props) {
	        var style = assign({}, props.defaultStyle, props.style)

	        if (!props.valid){
	            assign(style, props.defaultInvalidStyle, props.invalidStyle)
	        }

	        return style
	    },

	    prepareInputProps: function(props) {

	        var inputProps = {
	            className: props.inputClassName
	        }

	        assign(inputProps, props.defaultInputProps, props.inputProps)

	        inputProps.key         = 'field'
	        inputProps.value       = props.value
	        inputProps.placeholder = props.placeholder
	        inputProps.onChange    = this.handleChange
	        inputProps.onSelect    = this.handleSelect
	        inputProps.style       = this.prepareInputStyle(props)
	        inputProps.onFocus     = this.handleFocus
	        inputProps.onBlur      = this.handleBlur
	        inputProps.name = props.name
	        inputProps.readOnly = props.readOnly

	        return inputProps
	    },

	    handleFocus: function(){
	        this._focused = true
	    },

	    handleBlur: function(){
	        this._focused = false
	    },

	    isFocused: function(){
	        return !!this._focused
	    },

	    prepareInputStyle: function(props) {
	        var inputStyle = props.inputProps?
	                            props.inputProps.style:
	                            null

	        var style = assign({}, props.defaultInputStyle, props.inputStyle, inputStyle)

	        if (!props.valid){
	            assign(style, props.defaultInputInvalidStyle, props.inputInvalidStyle)
	        }

	        return style
	    },

	    prepareClearToolStyle: function(props, state) {
	        var defaultClearToolOverStyle
	        var clearToolOverStyle
	        var clearToolColor

	        if (state && state.clearToolOver){
	            defaultClearToolOverStyle = props.defaultClearToolOverStyle
	            clearToolOverStyle = props.clearToolOverStyle
	        }

	        if (props.clearToolColor){
	            clearToolColor = {
	                color: props.clearToolColor
	            }
	            if (state && state.clearToolOver && props.clearToolOverColor){
	                clearToolColor = {
	                    color: props.clearToolOverColor
	                }
	            }
	        }

	        var style = assign(
	                        {},
	                        props.defaultClearToolStyle,
	                        defaultClearToolOverStyle,
	                        clearToolColor,
	                        props.clearToolStyle,
	                        clearToolOverStyle
	                    )

	        return style
	    }
	}

	var ReactClass = React.createClass(DESCRIPTOR)

	ReactClass.descriptor = DESCRIPTOR

	module.exports = ReactClass

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'

	var React    = __webpack_require__(1)
	var LoadMask = __webpack_require__(16)
	var Title = __webpack_require__(13)
	var TitleFactory = React.createFactory(Title)
	var Row = __webpack_require__(14)
	var RowFactory = React.createFactory(Row)
	var assign   = __webpack_require__(15)

	var stringOrNumber = React.PropTypes.oneOfType([
	    React.PropTypes.number,
	    React.PropTypes.string
	])

	function emptyFn(){}

	function scrollToRowIfNeeded(row, parentNode, scrollConfig){
	    parentNode       = parentNode || row.parentNode
	    var scrollTop    = parentNode.scrollTop
	    var parentHeight = parentNode.offsetHeight
	    var scrollBottom = scrollTop + parentHeight
	    var rowTop       = row.offsetTop// + scrollTop
	    var rowBottom    = rowTop + row.offsetHeight

	    if (rowTop < scrollTop || rowBottom > scrollBottom){
	        row.scrollIntoView(scrollConfig)

	        return true
	    }

	    return false
	}

	module.exports = React.createClass({

	    displayName: 'ReactListView',

	    propTypes: {
	        renderText: React.PropTypes.func,
	        title     : stringOrNumber,
	        rowHeight : stringOrNumber,
	        rowStyle  : React.PropTypes.object,

	        data       : React.PropTypes.array,
	        loading    : React.PropTypes.bool,
	        emptyText  : React.PropTypes.string,
	        loadingText: React.PropTypes.string,

	        idProperty     : React.PropTypes.string,
	        displayProperty: React.PropTypes.string,
	        selected       : React.PropTypes.object,

	        sortable     : React.PropTypes.bool,
	        sortDirection: stringOrNumber,
	        toggleSort   : React.PropTypes.func
	    },

	    scrollToRow: function(row) {
	        if (row){
	            return scrollToRowIfNeeded.call(this, row, this.refs.listWrap.getDOMNode())
	        }
	    },

	    scrollToRowById: function(id) {
	        this.scrollToRow(this.findRowById(id))
	    },

	    scrollToRowByIndex: function(index) {
	        this.scrollToRow(this.findRowByIndex(index))

	    },

	    findRowByIndex: function(index) {
	        var item = this.props.data[index]

	        if (!item){
	            return
	        }

	        var id = item[this.props.idProperty]

	        return this.findRowById(id)
	    },

	    findRowById: function(id) {
	        if (this.isMounted()){
	            return this.getDOMNode().querySelector('[data-row-id="' + id + '"]')
	        }
	    },

	    getDefaultProps: function() {
	        return {
	            rowBoundMethods: {
	                onRowMouseDown: 'onMouseDown',
	                onRowMouseUp  : 'onMouseUp',
	                onRowClick    : 'onClick',
	                onRowMouseOver: 'onMouseOver',
	                onRowMouseOut : 'onMouseOut'
	            },

	            sortable: true,

	            selectRowOnClick: true,

	            idProperty: 'id',
	            displayProperty: 'text',
	            emptyText: 'No records',
	            loadingText: '',

	            rowHeight: null,

	            defaultStyle: {},
	            defaultListStyle: {}
	        }
	    },

	    getInitialState: function() {
	        return {}
	    },

	    render: function() {

	        var state = this.state
	        var props = this.prepareProps(this.props)
	        var title = this.renderTitle(props, state)
	        var body  = this.renderBody(props, state)

	        props.data = null

	        if (props.scrollToIndex){
	            setTimeout(function(){
	                this.scrollToRow(props.scrollToIndex)
	            }.bind(this), 0)
	        }

	        return (
	            React.createElement("div", React.__spread({},  props), 
	                title, 
	                body
	            )
	        )
	    },

	    prepareProps: function(thisProps) {

	        var props = assign({}, thisProps)

	        props.style         = this.prepareStyle(props)
	        props.titleStyle    = this.prepareTitleStyle(props)
	        props.bodyStyle     = this.prepareBodyStyle(props)
	        props.listWrapStyle = this.prepareListWrapStyle(props)
	        props.rowStyle      = this.prepareRowStyle(props)

	        props.className = this.prepareClassName(props)

	        return props
	    },

	    prepareStyle: function(props) {

	        var style = {}

	        assign(style, props.defaultStyle, props.style)

	        return style
	    },

	    prepareClassName: function(props) {
	        var className = props.className || ''

	        className += ' z-listview'

	        if (!this.getCount(props)){
	            className += ' z-empty'
	        }

	        var sortableCls = props.sortable?
	                            ' z-sortable':
	                            ''
	        if (props.sortable && props.sortDirection){
	            sortableCls += props.sortDirection === 'asc' || props.sortDirection === 1?
	                                ' z-asc':
	                                props.sortDirection === 'desc' || props.sortDirection === -1?
	                                    ' z-desc':
	                                    ''
	        }

	        className += sortableCls

	        return className
	    },

	    prepareBodyStyle: function(props) {
	        var bodyStyle = assign({}, props.defaultBodyStyle, props.bodyStyle)

	        return bodyStyle
	    },

	    prepareTitleStyle: function(props) {
	        var titleStyle = assign({}, props.defaultTitleStyle, props.titleStyle)

	        return titleStyle
	    },

	    prepareRowStyle: function(props) {

	        var rowStyle = assign({}, props.defaultRowStyle, props.rowStyle, {
	            height: props.rowHeight
	        })

	        return rowStyle
	    },

	    prepareListWrapStyle: function(props) {
	        var style = {}

	        assign(style, props.defaultListStyle, {
	            border   : props.listBorder,
	            width    : props.listWidth  || props.listSize,
	            height   : props.listHeight || props.listSize,
	            maxHeight: props.listMaxHeight,
	            maxWidth : props.listMaxWidth
	        }, props.listStyle)

	        return style
	    },

	    renderTitle: function(props) {
	        if (props.title){
	            return (props.titleFactory || TitleFactory)({
	                style    : props.titleStyle,
	                className: (props.titleClassName || '') + ' z-title',
	                onClick: this.handleTitleClick.bind(this, props)
	            }, props.title, this.renderTitleSort(props))
	        }
	    },

	    renderTitleSort: function(props) {
	        if (props.sortable !== false){
	            return React.createElement("span", {className: "z-icon-sort-info"})
	        }
	    },

	    renderBody: function(props, state) {

	        var bodyClassName = props.bodyClassName || ''

	        bodyClassName += ' z-body'

	        return (
	            React.createElement("div", {className: bodyClassName, style: props.bodyStyle}, 
	                this.renderListWrap(props, state), 
	                React.createElement(LoadMask, {visible: props.loading})
	            )
	        )
	    },

	    renderListWrap: function(props, state) {
	        return (
	            React.createElement("div", {ref: "listWrap", className: "z-list-wrap", style: props.listWrapStyle}, 
	                React.createElement("div", {className: "z-scroller"}, 
	                    this.renderList(props, state)
	                )
	            )
	        )
	    },

	    getCount: function(props) {
	        return props.data?
	                    props.data.length:
	                    0
	    },

	    handleTitleClick: function(props, event){
	        if (props.sortable){
	            ;(props.toggleSort || this.toggleSort)(props)
	        }
	    },

	    toggleSort: function(props){
	        var dir = props.sortDirection === 'asc'?
	                    1:
	                    props.sortDirection === 'desc'?
	                        -1:
	                        props.sortDirection

	        var newDir
	        if (dir != 1 && dir != -1){
	            newDir = 1
	        } else {
	            newDir = dir === 1? -1: dir === -1?  0: 1
	        }

	        ;(props.onSortChange || emptyFn)(newDir, props)
	    },

	    renderList: function(props, state) {

	        var className = 'z-list'
	        var count = this.getCount(props)
	        var empty = false

	        if (!count){
	            empty = true
	            className += ' z-empty'
	        }

	        var data = props.data || []

	        return (
	            React.createElement("ul", {className: className, style: props.listTagStyle}, 
	                empty? this.renderEmpty(props): data.map(this.renderRow.bind(this, props, state))
	            )
	        )
	    },

	    renderEmpty: function(props) {
	        return React.createElement("li", {className: "z-row-empty"}, props.loading? props.loadingText: props.emptyText)
	    },

	    renderRow: function(props, state, item, index, arr) {
	        var key  = item[props.idProperty]
	        var text = item[props.displayProperty]

	        if (typeof props.renderText == 'function'){
	            text = props.renderText(text, item, index, props)
	        }

	        var rowClassName = ''

	        if (props.selected && props.selected[key]){
	            rowClassName += ' z-selected'
	        }

	        if (state.mouseOverKey === key){
	            rowClassName += ' z-over'
	        }

	        var rowProps = {
	            key      : key,
	            style    : props.rowStyle,
	            'data-row-id': key,
	            index    : index,
	            first    : index === 0,
	            last     : index === arr.length - 1,
	            item     : item,
	            className: rowClassName,
	            onClick  : this.handleRowClick.bind(this, item, index, props),
	            children : text
	        }

	        this.bindRowMethods(props, rowProps, props.rowBoundMethods, item, index)

	        rowProps.className = this.prepareRowClassName(rowProps, this.state)

	        if (props.rowFactory){
	            rowProps.onMouseOver = this.handleRowMouseOver.bind(this, item, index, props, key)
	            rowProps.onMouseOut  = this.handleRowMouseOut.bind(this, item, index, props, key)
	        }

	        return (props.rowFactory || RowFactory)(rowProps)
	    },

	    handleRowMouseOver: function(item, index, props, key){
	        this.setState({
	            mouseOverKey: key
	        })
	    },

	    handleRowMouseOut: function(item, index, props, key){
	        this.setState({
	            mouseOverKey: undefined
	        })
	    },

	    bindRowMethods: function(props, rowProps, bindMethods, item, index) {
	        Object.keys(bindMethods).forEach(function(key){
	            var eventName = bindMethods[key]

	            if (props[key]){
	                rowProps[eventName] = props[key].bind(this, item, index, props)
	            }
	        }, this)
	    },

	    prepareRowClassName: function(rowProps, state) {
	        var index = rowProps.index

	        var className = (rowProps.className || '') + ' z-row'

	        if (index % 2){
	            className += ' z-odd'
	        } else {
	            className += ' z-even'
	        }

	        if (rowProps.first){
	            className += ' z-first'
	        }

	        if (rowProps.last){
	            className += ' z-last'
	        }

	        return className
	    },

	    handleRowClick: function(item, index, props, event) {

	        if (props.selectRowOnClick){
	            var key         = item[props.idProperty]
	            var selected    = props.selected || {}
	            var rowSelected = !!selected[key]

	            var fn = rowSelected? 'onDeselect': 'onSelect'

	            ;(props[fn] || emptyFn)(key, item, index, selected, props)
	            ;(props.onSelectionChange || emptyFn)(key, item, index, selected, props)
	        }

	        ;(props.onRowClick || emptyFn)(item, index, props, event)
	    }
	})

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Region = __webpack_require__(12)
	var assign = __webpack_require__(7)
	var selectParent = __webpack_require__(11)

	module.exports = function(props, listProps, constrainTo){
	    var constrainRegion

	    if (constrainTo === true){
	        constrainRegion = Region.getDocRegion()
	    }

	    if (typeof constrainTo === 'string'){
	        var parent = selectParent(constrainTo, this.getDOMNode())
	        constrainRegion = Region.from(parent)
	    }

	    if (typeof constrainTo === 'function'){
	        constrainRegion = Region.from(constrainTo())
	    }

	    var input = this.getInput()

	    if (!input){
	        return
	    }

	    var inputRegion = Region.from(input)

	    if (typeof props.constrainList === 'function'){
	        props.constrainList(listProps, inputRegion, constrainRegion)
	        return
	    }

	    if (!constrainRegion || !(constrainRegion instanceof Region)){
	        return
	    }

	    var topAvailable    = inputRegion.top - constrainRegion.top
	    var bottomAvailable = constrainRegion.bottom - inputRegion.bottom

	    var max = bottomAvailable

	    var style = assign(listProps.style)

	    if (topAvailable > bottomAvailable){
	        style.position = 'absolute'
	        style.width    = '100%'
	        style.bottom   = '100%'
	        max            = topAvailable
	    }

	    listProps.listMaxHeight = Math.max(50, max - 10)
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var curry   = __webpack_require__(18)
	var matches = __webpack_require__(19)

	module.exports = curry(function(selector, node){
	    while (node = node.parentElement){
	        if (matches.call(node, selector)){
	            return node
	        }
	    }
	})

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(20)

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(15)

	module.exports = React.createClass({

	    displayName: 'ReactListView.Title',

	    getDefaultProps: function() {
	        return {
	            title: ''
	        }
	    },

	    render: function() {
	        var props = this.prepareProps(this.props)

	        return React.createElement("div", React.__spread({},  props))
	    },

	    prepareProps: function(thisProps) {
	        var props = {}

	        assign(props, thisProps)

	        return props
	    }
	})

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(15)

	module.exports = React.createClass({

	    displayName: 'ReactListView.Row',

	    render: function() {

	        var props = this.prepareProps(this.props, this.state)

	        return React.createElement("li", React.__spread({},  props))
	    },

	    getInitialState: function() {
	        return {}
	    },

	    prepareProps: function(thisProps, state) {
	        var props = {}

	        assign(props, thisProps)

	        props.onMouseOver = this.handleMouseOver
	        props.onMouseOut  = this.handleMouseOut

	        props.className = this.prepareClassName(props, state)

	        return props

	    },

	    prepareClassName: function(props, state) {
	        var index = props.index

	        var className = props.className || ''

	        if (state.mouseOver || props.mouseOver){
	            className += ' z-over'
	        }

	        return className
	    },

	    handleMouseOver: function() {
	        this.setState({
	            mouseOver: true
	        })
	    },

	    handleMouseOut: function() {
	        this.setState({
	            mouseOver: false
	        })
	    }
	})

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(22)
	var Loader = __webpack_require__(21)

	module.exports = React.createClass({

	    displayName: 'LoadMask',

	    getDefaultProps: function(){

	        return {
	            visibleDisplayValue: 'block',
	            defaultStyle: {
	                position: 'absolute',
	                width   : '100%',
	                height  : '100%',
	                display : 'none',
	                top: 0,
	                left: 0
	            }
	        }
	    },

	    render: function(){
	        var props = assign({}, this.props)

	        this.prepareStyle(props)

	        props.className = props.className || ''
	        props.className += ' loadmask'

	        return React.DOM.div(props, React.createElement(Loader, {size: props.size}))
	    },

	    prepareStyle: function(props){

	        var style = {}

	        assign(style, props.defaultStyle)
	        assign(style, props.style)

	        style.display = props.visible?
	                        props.visibleDisplayValue:
	                        'none'

	        props.style = style
	    }
	})

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}

	module.exports = curry

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var proto = Element.prototype

	var nativeMatches = proto.matches ||
	  proto.mozMatchesSelector ||
	  proto.msMatchesSelector ||
	  proto.oMatchesSelector ||
	  proto.webkitMatchesSelector

	module.exports = nativeMatches


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn    = __webpack_require__(26)
	var newify    = __webpack_require__(27)
	var copyUtils = __webpack_require__(28)
	var copyList  = copyUtils.copyList
	var copy      = copyUtils.copy
	var isObject  = __webpack_require__(29).object
	var EventEmitter = __webpack_require__(30).EventEmitter
	var inherits = __webpack_require__(23)
	var VALIDATE = __webpack_require__(24)

	/**
	 * @class Region
	 *
	 * The Region is an abstraction that allows the developer to refer to rectangles on the screen,
	 * and move them around, make diffs and unions, detect intersections, compute areas, etc.
	 *
	 * ## Creating a region
	 *      var region = require('region')({
	 *          top  : 10,
	 *          left : 10,
	 *          bottom: 100,
	 *          right : 100
	 *      })
	 *      //this region is a square, 90x90, starting from (10,10) to (100,100)
	 *
	 *      var second = require('region')({ top: 10, left: 100, right: 200, bottom: 60})
	 *      var union  = region.getUnion(second)
	 *
	 *      //the "union" region is a union between "region" and "second"
	 */

	var POINT_POSITIONS = {
	        cy: 'YCenter',
	        cx: 'XCenter',
	        t : 'Top',
	        tc: 'TopCenter',
	        tl: 'TopLeft',
	        tr: 'TopRight',
	        b : 'Bottom',
	        bc: 'BottomCenter',
	        bl: 'BottomLeft',
	        br: 'BottomRight',
	        l : 'Left',
	        lc: 'LeftCenter',
	        r : 'Right',
	        rc: 'RightCenter',
	        c : 'Center'
	    }

	/**
	 * @constructor
	 *
	 * Construct a new Region.
	 *
	 * Example:
	 *
	 *      var r = new Region({ top: 10, left: 20, bottom: 100, right: 200 })
	 *
	 *      //or, the same, but with numbers (can be used with new or without)
	 *
	 *      r = Region(10, 200, 100, 20)
	 *
	 *      //or, with width and height
	 *
	 *      r = Region({ top: 10, left: 20, width: 180, height: 90})
	 *
	 * @param {Number|Object} top The top pixel position, or an object with top, left, bottom, right properties. If an object is passed,
	 * instead of having bottom and right, it can have width and height.
	 *
	 * @param {Number} right The right pixel position
	 * @param {Number} bottom The bottom pixel position
	 * @param {Number} left The left pixel position
	 *
	 * @return {Region} this
	 */
	var REGION = function(top, right, bottom, left){

	    if (!(this instanceof REGION)){
	        return newify(REGION, arguments)
	    }

	    EventEmitter.call(this)

	    if (isObject(top)){
	        copyList(top, this, ['top','right','bottom','left'])

	        if (top.bottom == null && top.height != null){
	            this.bottom = this.top + top.height
	        }
	        if (top.right == null && top.width != null){
	            this.right = this.left + top.width
	        }

	        if (top.emitChangeEvents){
	            this.emitChangeEvents = top.emitChangeEvents
	        }
	    } else {
	        this.top    = top
	        this.right  = right
	        this.bottom = bottom
	        this.left   = left
	    }

	    this[0] = this.left
	    this[1] = this.top

	    VALIDATE(this)
	}

	inherits(REGION, EventEmitter)

	copy({

	    /**
	     * @cfg {Boolean} emitChangeEvents If this is set to true, the region
	     * will emit 'changesize' and 'changeposition' whenever the size or the position changs
	     */
	    emitChangeEvents: false,

	    /**
	     * Returns this region, or a clone of this region
	     * @param  {Boolean} [clone] If true, this method will return a clone of this region
	     * @return {Region}       This region, or a clone of this
	     */
	    getRegion: function(clone){
	        return clone?
	                    this.clone():
	                    this
	    },

	    /**
	     * Sets the properties of this region to those of the given region
	     * @param {Region/Object} reg The region or object to use for setting properties of this region
	     * @return {Region} this
	     */
	    setRegion: function(reg){

	        if (reg instanceof REGION){
	            this.set(reg.get())
	        } else {
	            this.set(reg)
	        }

	        return this
	    },

	    /**
	     * Returns true if this region is valid, false otherwise
	     *
	     * @param  {Region} region The region to check
	     * @return {Boolean}        True, if the region is valid, false otherwise.
	     * A region is valid if
	     *  * left <= right  &&
	     *  * top  <= bottom
	     */
	    validate: function(){
	        return REGION.validate(this)
	    },

	    _before: function(){
	        if (this.emitChangeEvents){
	            return copyList(this, {}, ['left','top','bottom','right'])
	        }
	    },

	    _after: function(before){
	        if (this.emitChangeEvents){

	            if(this.top != before.top || this.left != before.left) {
	                this.emitPositionChange()
	            }

	            if(this.right != before.right || this.bottom != before.bottom) {
	                this.emitSizeChange()
	            }
	        }
	    },

	    notifyPositionChange: function(){
	        this.emit('changeposition', this)
	    },

	    emitPositionChange: function(){
	        this.notifyPositionChange()
	    },

	    notifySizeChange: function(){
	        this.emit('changesize', this)
	    },

	    emitSizeChange: function(){
	        this.notifySizeChange()
	    },

	    /**
	     * Add the given amounts to each specified side. Example
	     *
	     *      region.add({
	     *          top: 50,    //add 50 px to the top side
	     *          bottom: -100    //substract 100 px from the bottom side
	     *      })
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @return {Region} this
	     */
	    add: function(directions){

	        var before = this._before()
	        var direction

	        for (direction in directions) if ( hasOwn(directions, direction) ) {
	            this[direction] += directions[direction]
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * The same as {@link #add}, but substracts the given values
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @return {Region} this
	     */
	    substract: function(directions){

	        var before = this._before()
	        var direction

	        for (direction in directions) if (hasOwn(directions, direction) ) {
	            this[direction] -= directions[direction]
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Retrieves the size of the region.
	     * @return {Object} An object with {width, height}, corresponding to the width and height of the region
	     */
	    getSize: function(){
	        return {
	            width  : this.getWidth(),
	            height : this.getHeight()
	        }
	    },

	    /**
	     * Move the region to the given position and keeps the region width and height.
	     *
	     * @param {Object} position An object with {top, left} properties. The values in {top,left} are used to move the region by the given amounts.
	     * @param {Number} [position.left]
	     * @param {Number} [position.top]
	     *
	     * @return {Region} this
	     */
	    setPosition: function(position){
	        var width  = this.getWidth(),
	            height = this.getHeight()

	        if (position.left){
	            position.right  = position.left + width
	        }

	        if (position.top){
	            position.bottom = position.top  + height
	        }

	        return this.set(position)
	    },

	    /**
	     * Sets both the height and the width of this region to the given size.
	     *
	     * @param {Number} size The new size for the region
	     * @return {Region} this
	     */
	    setSize: function(size){
	        if (size.height && size.width){
	            return this.set({
	                right  : this.left + size.width,
	                bottom : this.top + size.height
	            })
	        }

	        if (size.width){
	            this.setWidth(size.width)
	        }

	        if (size.height){
	            this.setHeight(size.height)
	        }

	        return this
	    },



	    /**
	     * @chainable
	     *
	     * Sets the width of this region
	     * @param {Number} width The new width for this region
	     * @return {Region} this
	     */
	    setWidth: function(width){
	        return this.set({
	            right: this.left + width
	        })
	    },

	    /**
	     * @chainable
	     *
	     * Sets the height of this region
	     * @param {Number} height The new height for this region
	     * @return {Region} this
	     */
	    setHeight: function(height){
	        return this.set({
	            bottom: this.top + height
	        })
	    },

	    /**
	     * Sets the given properties on this region
	     *
	     * @param {Object} directions an object containing top, left, and EITHER bottom, right OR width, height
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @param {Number} [directions.bottom]
	     * @param {Number} [directions.right]
	     *
	     * @param {Number} [directions.width]
	     * @param {Number} [directions.height]
	     *
	     *
	     * @return {Region} this
	     */
	    set: function(directions){
	        var before = this._before()

	        copyList(directions, this, ['left','top','bottom','right'])

	        if (directions.bottom == null && directions.height != null){
	            this.bottom = this.top + directions.height
	        }
	        if (directions.right == null && directions.width != null){
	            this.right = this.left + directions.width
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Retrieves the given property from this region. If no property is given, return an object
	     * with {left, top, right, bottom}
	     *
	     * @param {String} [dir] the property to retrieve from this region
	     * @return {Number/Object}
	     */
	    get: function(dir){
	        return dir? this[dir]:
	                    copyList(this, {}, ['left','right','top','bottom'])
	    },

	    /**
	     * Shifts this region to either top, or left or both.
	     * Shift is similar to {@link #add} by the fact that it adds the given dimensions to top/left sides, but also adds the given dimensions
	     * to bottom and right
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @return {Region} this
	     */
	    shift: function(directions){

	        var before = this._before()

	        if (directions.top){
	            this.top    += directions.top
	            this.bottom += directions.top
	        }

	        if (directions.left){
	            this.left  += directions.left
	            this.right += directions.left
	        }

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Same as {@link #shift}, but substracts the given values
	     * @chainable
	     *
	     * @param {Object} directions
	     * @param {Number} [directions.top]
	     * @param {Number} [directions.left]
	     *
	     * @return {Region} this
	     */
	    unshift: function(directions){

	        if (directions.top){
	            directions.top *= -1
	        }

	        if (directions.left){
	            directions.left *= -1
	        }

	        return this.shift(directions)
	    },

	    /**
	     * Compare this region and the given region. Return true if they have all the same size and position
	     * @param  {Region} region The region to compare with
	     * @return {Boolean}       True if this and region have same size and position
	     */
	    equals: function(region){
	        return this.equalsPosition(region) && this.equalsSize(region)
	    },

	    /**
	     * Returns true if this region has the same bottom,right properties as the given region
	     * @param  {Region/Object} size The region to compare against
	     * @return {Boolean}       true if this region is the same size as the given size
	     */
	    equalsSize: function(size){
	        var isInstance = size instanceof REGION

	        var s = {
	            width: size.width == null && isInstance?
	                    size.getWidth():
	                    size.width,

	            height: size.height == null && isInstance?
	                    size.getHeight():
	                    size.height
	        }
	        return this.getWidth() == s.width && this.getHeight() == s.height
	    },

	    /**
	     * Returns true if this region has the same top,left properties as the given region
	     * @param  {Region} region The region to compare against
	     * @return {Boolean}       true if this.top == region.top and this.left == region.left
	     */
	    equalsPosition: function(region){
	        return this.top == region.top && this.left == region.left
	    },

	    /**
	     * Adds the given ammount to the left side of this region
	     * @param {Number} left The ammount to add
	     * @return {Region} this
	     */
	    addLeft: function(left){
	        var before = this._before()

	        this.left = this[0] = this.left + left

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the top side of this region
	     * @param {Number} top The ammount to add
	     * @return {Region} this
	     */
	    addTop: function(top){
	        var before = this._before()

	        this.top = this[1] = this.top + top

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the bottom side of this region
	     * @param {Number} bottom The ammount to add
	     * @return {Region} this
	     */
	    addBottom: function(bottom){
	        var before = this._before()

	        this.bottom += bottom

	        this._after(before)

	        return this
	    },

	    /**
	     * Adds the given ammount to the right side of this region
	     * @param {Number} right The ammount to add
	     * @return {Region} this
	     */
	    addRight: function(right){
	        var before = this._before()

	        this.right += right

	        this._after(before)

	        return this
	    },

	    /**
	     * Minimize the top side.
	     * @return {Region} this
	     */
	    minTop: function(){
	        return this.expand({top: 1})
	    },
	    /**
	     * Minimize the bottom side.
	     * @return {Region} this
	     */
	    maxBottom: function(){
	        return this.expand({bottom: 1})
	    },
	    /**
	     * Minimize the left side.
	     * @return {Region} this
	     */
	    minLeft: function(){
	        return this.expand({left: 1})
	    },
	    /**
	     * Maximize the right side.
	     * @return {Region} this
	     */
	    maxRight: function(){
	        return this.expand({right: 1})
	    },

	    /**
	     * Expands this region to the dimensions of the given region, or the document region, if no region is expanded.
	     * But only expand the given sides (any of the four can be expanded).
	     *
	     * @param {Object} directions
	     * @param {Boolean} [directions.top]
	     * @param {Boolean} [directions.bottom]
	     * @param {Boolean} [directions.left]
	     * @param {Boolean} [directions.right]
	     *
	     * @param {Region} [region] the region to expand to, defaults to the document region
	     * @return {Region} this region
	     */
	    expand: function(directions, region){
	        var docRegion = region || REGION.getDocRegion()
	        var list      = []
	        var direction
	        var before = this._before()

	        for (direction in directions) if ( hasOwn(directions, direction) ) {
	            list.push(direction)
	        }

	        copyList(docRegion, this, list)

	        this[0] = this.left
	        this[1] = this.top

	        this._after(before)

	        return this
	    },

	    /**
	     * Returns a clone of this region
	     * @return {Region} A new region, with the same position and dimension as this region
	     */
	    clone: function(){
	        return new REGION({
	                    top    : this.top,
	                    left   : this.left,
	                    right  : this.right,
	                    bottom : this.bottom
	                })
	    },

	    /**
	     * Returns true if this region contains the given point
	     * @param {Number/Object} x the x coordinate of the point
	     * @param {Number} [y] the y coordinate of the point
	     *
	     * @return {Boolean} true if this region constains the given point, false otherwise
	     */
	    containsPoint: function(x, y){
	        if (arguments.length == 1){
	            y = x.y
	            x = x.x
	        }

	        return this.left <= x  &&
	               x <= this.right &&
	               this.top <= y   &&
	               y <= this.bottom
	    },

	    /**
	     *
	     * @param region
	     *
	     * @return {Boolean} true if this region contains the given region, false otherwise
	     */
	    containsRegion: function(region){
	        return this.containsPoint(region.left, region.top)    &&
	               this.containsPoint(region.right, region.bottom)
	    },

	    /**
	     * Returns an object with the difference for {top, bottom} positions betwen this and the given region,
	     *
	     * See {@link #diff}
	     * @param  {Region} region The region to use for diff
	     * @return {Object}        {top,bottom}
	     */
	    diffHeight: function(region){
	        return this.diff(region, {top: true, bottom: true})
	    },

	    /**
	     * Returns an object with the difference for {left, right} positions betwen this and the given region,
	     *
	     * See {@link #diff}
	     * @param  {Region} region The region to use for diff
	     * @return {Object}        {left,right}
	     */
	    diffWidth: function(region){
	        return this.diff(region, {left: true, right: true})
	    },

	    /**
	     * Returns an object with the difference in sizes for the given directions, between this and region
	     *
	     * @param  {Region} region     The region to use for diff
	     * @param  {Object} directions An object with the directions to diff. Can have any of the following keys:
	     *  * left
	     *  * right
	     *  * top
	     *  * bottom
	     *
	     * @return {Object} and object with the same keys as the directions object, but the values being the
	     * differences between this region and the given region
	     */
	    diff: function(region, directions){
	        var result = {}
	        var dirName

	        for (dirName in directions) if ( hasOwn(directions, dirName) ) {
	            result[dirName] = this[dirName] - region[dirName]
	        }

	        return result
	    },

	    /**
	     * Returns the position, in {left,top} properties, of this region
	     *
	     * @return {Object} {left,top}
	     */
	    getPosition: function(){
	        return {
	            left: this.left,
	            top : this.top
	        }
	    },

	    /**
	     * Returns the point at the given position from this region.
	     *
	     * @param {String} position Any of:
	     *
	     *  * 'cx' - See {@link #getPointXCenter}
	     *  * 'cy' - See {@link #getPointYCenter}
	     *  * 'b'  - See {@link #getPointBottom}
	     *  * 'bc' - See {@link #getPointBottomCenter}
	     *  * 'l'  - See {@link #getPointLeft}
	     *  * 'lc' - See {@link #getPointLeftCenter}
	     *  * 't'  - See {@link #getPointTop}
	     *  * 'tc' - See {@link #getPointTopCenter}
	     *  * 'r'  - See {@link #getPointRight}
	     *  * 'rc' - See {@link #getPointRightCenter}
	     *  * 'c'  - See {@link #getPointCenter}
	     *  * 'tl' - See {@link #getPointTopLeft}
	     *  * 'bl' - See {@link #getPointBottomLeft}
	     *  * 'br' - See {@link #getPointBottomRight}
	     *  * 'tr' - See {@link #getPointTopRight}
	     *
	     * @param {Boolean} asLeftTop
	     *
	     * @return {Object} either an object with {x,y} or {left,top} if asLeftTop is true
	     */
	    getPoint: function(position, asLeftTop){

	        //<debug>
	        if (!POINT_POSITIONS[position]) {
	            console.warn('The position ', position, ' could not be found! Available options are tl, bl, tr, br, l, r, t, b.');
	        }
	        //</debug>

	        var method = 'getPoint' + POINT_POSITIONS[position],
	            result = this[method]()

	        if (asLeftTop){
	            return {
	                left : result.x,
	                top  : result.y
	            }
	        }

	        return result
	    },

	    /**
	     * Returns a point with x = null and y being the middle of the left region segment
	     * @return {Object} {x,y}
	     */
	    getPointYCenter: function(){
	        return { x: null, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point with y = null and x being the middle of the top region segment
	     * @return {Object} {x,y}
	     */
	    getPointXCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: null }
	    },

	    /**
	     * Returns a point with x = null and y the region top position on the y axis
	     * @return {Object} {x,y}
	     */
	    getPointTop: function(){
	        return { x: null, y: this.top }
	    },

	    /**
	     * Returns a point that is the middle point of the region top segment
	     * @return {Object} {x,y}
	     */
	    getPointTopCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.top }
	    },

	    /**
	     * Returns a point that is the top-left point of the region
	     * @return {Object} {x,y}
	     */
	    getPointTopLeft: function(){
	        return { x: this.left, y: this.top}
	    },

	    /**
	     * Returns a point that is the top-right point of the region
	     * @return {Object} {x,y}
	     */
	    getPointTopRight: function(){
	        return { x: this.right, y: this.top}
	    },

	    /**
	     * Returns a point with x = null and y the region bottom position on the y axis
	     * @return {Object} {x,y}
	     */
	    getPointBottom: function(){
	        return { x: null, y: this.bottom }
	    },

	    /**
	     * Returns a point that is the middle point of the region bottom segment
	     * @return {Object} {x,y}
	     */
	    getPointBottomCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.bottom }
	    },

	    /**
	     * Returns a point that is the bottom-left point of the region
	     * @return {Object} {x,y}
	     */
	    getPointBottomLeft: function(){
	        return { x: this.left, y: this.bottom}
	    },

	    /**
	     * Returns a point that is the bottom-right point of the region
	     * @return {Object} {x,y}
	     */
	    getPointBottomRight: function(){
	        return { x: this.right, y: this.bottom}
	    },

	    /**
	     * Returns a point with y = null and x the region left position on the x axis
	     * @return {Object} {x,y}
	     */
	    getPointLeft: function(){
	        return { x: this.left, y: null }
	    },

	    /**
	     * Returns a point that is the middle point of the region left segment
	     * @return {Object} {x,y}
	     */
	    getPointLeftCenter: function(){
	        return { x: this.left, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point with y = null and x the region right position on the x axis
	     * @return {Object} {x,y}
	     */
	    getPointRight: function(){
	        return { x: this.right, y: null }
	    },

	    /**
	     * Returns a point that is the middle point of the region right segment
	     * @return {Object} {x,y}
	     */
	    getPointRightCenter: function(){
	        return { x: this.right, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * Returns a point that is the center of the region
	     * @return {Object} {x,y}
	     */
	    getPointCenter: function(){
	        return { x: this.left + this.getWidth() / 2, y: this.top + this.getHeight() / 2 }
	    },

	    /**
	     * @return {Number} returns the height of the region
	     */
	    getHeight: function(){
	        return this.bottom - this.top
	    },

	    /**
	     * @return {Number} returns the width of the region
	     */
	    getWidth: function(){
	        return this.right - this.left
	    },

	    /**
	     * @return {Number} returns the top property of the region
	     */
	    getTop: function(){
	        return this.top
	    },

	    /**
	     * @return {Number} returns the left property of the region
	     */
	    getLeft: function(){
	        return this.left
	    },

	    /**
	     * @return {Number} returns the bottom property of the region
	     */
	    getBottom: function(){
	        return this.bottom
	    },

	    /**
	     * @return {Number} returns the right property of the region
	     */
	    getRight: function(){
	        return this.right
	    },

	    /**
	     * Returns the area of the region
	     * @return {Number} the computed area
	     */
	    getArea: function(){
	        return this.getWidth() * this.getHeight()
	    },

	    constrainTo: function(contrain){
	        var intersect = this.getIntersection(contrain)
	        var shift

	        if (!intersect || !intersect.equals(this)){

	            var contrainWidth  = contrain.getWidth(),
	                contrainHeight = contrain.getHeight()

	            if (this.getWidth() > contrainWidth){
	                this.left = contrain.left
	                this.setWidth(contrainWidth)
	            }

	            if (this.getHeight() > contrainHeight){
	                this.top = contrain.top
	                this.setHeight(contrainHeight)
	            }

	            shift = {}

	            if (this.right > contrain.right){
	                shift.left = contrain.right - this.right
	            }

	            if (this.bottom > contrain.bottom){
	                shift.top = contrain.bottom - this.bottom
	            }

	            if (this.left < contrain.left){
	                shift.left = contrain.left - this.left
	            }

	            if (this.top < contrain.top){
	                shift.top = contrain.top - this.top
	            }

	            this.shift(shift)

	            return true
	        }

	        return false
	    },

	    __IS_REGION: true

	    /**
	     * @property {Number} top
	     */

	    /**
	     * @property {Number} right
	     */

	    /**
	     * @property {Number} bottom
	     */

	    /**
	     * @property {Number} left
	     */

	    /**
	     * @property {Number} [0] the top property
	     */

	    /**
	     * @property {Number} [1] the left property
	     */

	    /**
	     * @method getIntersection
	     * Returns a region that is the intersection of this region and the given region
	     * @param  {Region} region The region to intersect with
	     * @return {Region}        The intersection region
	     */

	    /**
	     * @method getUnion
	     * Returns a region that is the union of this region with the given region
	     * @param  {Region} region  The region to make union with
	     * @return {Region}        The union region. The smallest region that contains both this and the given region.
	     */

	}, REGION.prototype)

	Object.defineProperties(REGION.prototype, {
	    width: {
	        get: function(){
	            return this.getWidth()
	        },
	        set: function(width){
	            return this.setWidth(width)
	        }
	    },
	    height: {
	        get: function(){
	            return this.getHeight()
	        },
	        set: function(height){
	            return this.setHeight(height)
	        }
	    }
	})

	__webpack_require__(25)(REGION)

	module.exports = REGION

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(22)

	module.exports = React.createClass({

	    displayName: 'Loader',

	    getDefaultProps: function(){
	        return {
	            defaultStyle: {
	                margin: 'auto',
	                position: 'absolute',
	                top: 0,
	                left: 0,
	                bottom: 0,
	                right: 0,
	            },
	            defaultClassName: 'loader',
	            size: 40,
	        }
	    },

	    render: function() {
	        var props = assign({}, this.props)

	        this.prepareStyle(props)

	        props.className = props.className || ''
	        props.className += ' ' + props.defaultClassName

	        return React.DOM.div(props,
	            React.createElement("div", {className: "loadbar loadbar-1"}),
	            React.createElement("div", {className: "loadbar loadbar-2"}),
	            React.createElement("div", {className: "loadbar loadbar-3"}),
	            React.createElement("div", {className: "loadbar loadbar-4"}),
	            React.createElement("div", {className: "loadbar loadbar-5"}),
	            React.createElement("div", {className: "loadbar loadbar-6"}),
	            React.createElement("div", {className: "loadbar loadbar-7"}),
	            React.createElement("div", {className: "loadbar loadbar-8"}),
	            React.createElement("div", {className: "loadbar loadbar-9"}),
	            React.createElement("div", {className: "loadbar loadbar-10"}),
	            React.createElement("div", {className: "loadbar loadbar-11"}),
	            React.createElement("div", {className: "loadbar loadbar-12"})
	        )
	    },

	    prepareStyle: function(props){

	        var style = {}

	        assign(style, props.defaultStyle)
	        assign(style, props.style)

	        style.width = props.size
	        style.height = props.size

	        props.style = style
	    }
	})

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	        constructor: {
	            value       : ctor,
	            enumerable  : false,
	            writable    : true,
	            configurable: true
	        }
	    })
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @static
	 * Returns true if the given region is valid, false otherwise.
	 * @param  {Region} region The region to check
	 * @return {Boolean}        True, if the region is valid, false otherwise.
	 * A region is valid if
	 *  * left <= right  &&
	 *  * top  <= bottom
	 */
	module.exports = function validate(region){

	    var isValid = true

	    if (region.right < region.left){
	        isValid = false
	        region.right = region.left
	    }

	    if (region.bottom < region.top){
	        isValid = false
	        region.bottom = region.top
	    }

	    return isValid
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn   = __webpack_require__(26)
	var VALIDATE = __webpack_require__(24)

	module.exports = function(REGION){

	    var MAX = Math.max
	    var MIN = Math.min

	    var statics = {
	        init: function(){
	            var exportAsNonStatic = {
	                getIntersection      : true,
	                getIntersectionArea  : true,
	                getIntersectionHeight: true,
	                getIntersectionWidth : true,
	                getUnion             : true
	            }
	            var thisProto = REGION.prototype
	            var newName

	            var exportHasOwn = hasOwn(exportAsNonStatic)
	            var methodName

	            for (methodName in exportAsNonStatic) if (exportHasOwn(methodName)) {
	                newName = exportAsNonStatic[methodName]
	                if (typeof newName != 'string'){
	                    newName = methodName
	                }

	                ;(function(proto, methodName, protoMethodName){

	                    proto[methodName] = function(region){
	                        //<debug>
	                        if (!REGION[protoMethodName]){
	                            console.warn('cannot find method ', protoMethodName,' on ', REGION)
	                        }
	                        //</debug>
	                        return REGION[protoMethodName](this, region)
	                    }

	                })(thisProto, newName, methodName);
	            }
	        },

	        validate: VALIDATE,

	        /**
	         * Returns the region corresponding to the documentElement
	         * @return {Region} The region corresponding to the documentElement. This region is the maximum region visible on the screen.
	         */
	        getDocRegion: function(){
	            return REGION.fromDOM(document.documentElement)
	        },

	        from: function(reg){
	            if (reg.__IS_REGION){
	                return reg
	            }

	            if (typeof document != 'undefined'){
	                if (typeof HTMLElement != 'undefined' && reg instanceof HTMLElement){
	                    return REGION.fromDOM(reg)
	                }

	                if (reg.type && typeof reg.pageX !== 'undefined' && typeof reg.pageY !== 'undefined'){
	                    return REGION.fromEvent(reg)
	                }
	            }

	            return REGION(reg)
	        },

	        fromEvent: function(event){
	            return REGION.fromPoint({
	                x: event.pageX,
	                y: event.pageY
	            })
	        },

	        fromDOM: function(dom){
	            var rect = dom.getBoundingClientRect()
	            // var docElem = document.documentElement
	            // var win     = window

	            // var top  = rect.top + win.pageYOffset - docElem.clientTop
	            // var left = rect.left + win.pageXOffset - docElem.clientLeft

	            return new REGION({
	                top   : rect.top,
	                left  : rect.left,
	                bottom: rect.bottom,
	                right : rect.right
	            })
	        },

	        /**
	         * @static
	         * Returns a region that is the intersection of the given two regions
	         * @param  {Region} first  The first region
	         * @param  {Region} second The second region
	         * @return {Region/Boolean}        The intersection region or false if no intersection found
	         */
	        getIntersection: function(first, second){

	            var area = this.getIntersectionArea(first, second)

	            if (area){
	                return new REGION(area)
	            }

	            return false
	        },

	        getIntersectionWidth: function(first, second){
	            var minRight  = MIN(first.right, second.right)
	            var maxLeft   = MAX(first.left,  second.left)

	            if (maxLeft < minRight){
	                return minRight  - maxLeft
	            }

	            return 0
	        },

	        getIntersectionHeight: function(first, second){
	            var maxTop    = MAX(first.top,   second.top)
	            var minBottom = MIN(first.bottom,second.bottom)

	            if (maxTop  < minBottom){
	                return minBottom - maxTop
	            }

	            return 0
	        },

	        getIntersectionArea: function(first, second){
	            var maxTop    = MAX(first.top,   second.top)
	            var minRight  = MIN(first.right, second.right)
	            var minBottom = MIN(first.bottom,second.bottom)
	            var maxLeft   = MAX(first.left,  second.left)

	            if (
	                    maxTop  < minBottom &&
	                    maxLeft < minRight
	                ){
	                return {
	                    top    : maxTop,
	                    right  : minRight,
	                    bottom : minBottom,
	                    left   : maxLeft,

	                    width  : minRight  - maxLeft,
	                    height : minBottom - maxTop
	                }
	            }

	            return false
	        },

	        /**
	         * @static
	         * Returns a region that is the union of the given two regions
	         * @param  {Region} first  The first region
	         * @param  {Region} second The second region
	         * @return {Region}        The union region. The smallest region that contains both given regions.
	         */
	        getUnion: function(first, second){
	            var top    = MIN(first.top,   second.top)
	            var right  = MAX(first.right, second.right)
	            var bottom = MAX(first.bottom,second.bottom)
	            var left   = MIN(first.left,  second.left)

	            return new REGION(top, right, bottom, left)
	        },

	        /**
	         * @static
	         * Returns a region. If the reg argument is a region, returns it, otherwise return a new region built from the reg object.
	         *
	         * @param  {Region} reg A region or an object with either top, left, bottom, right or
	         * with top, left, width, height
	         * @return {Region} A region
	         */
	        getRegion: function(reg){
	            return REGION.from(reg)
	        },

	        /**
	         * Creates a region that corresponds to a point.
	         *
	         * @param  {Object} xy The point
	         * @param  {Number} xy.x
	         * @param  {Number} xy.y
	         *
	         * @return {Region}    The new region, with top==xy.y, bottom = xy.y and left==xy.x, right==xy.x
	         */
	        fromPoint: function(xy){
	            return new REGION({
	                        top    : xy.y,
	                        bottom : xy.y,
	                        left   : xy.x,
	                        right  : xy.x
	                    })
	        }
	    }

	    Object.keys(statics).forEach(function(key){
	        REGION[key] = statics[key]
	    })

	    REGION.init()
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var hasOwn = Object.prototype.hasOwnProperty

	function curry(fn, n){

	    if (typeof n !== 'number'){
	        n = fn.length
	    }

	    function getCurryClosure(prevArgs){

	        function curryClosure() {

	            var len  = arguments.length
	            var args = [].concat(prevArgs)

	            if (len){
	                args.push.apply(args, arguments)
	            }

	            if (args.length < n){
	                return getCurryClosure(args)
	            }

	            return fn.apply(this, args)
	        }

	        return curryClosure
	    }

	    return getCurryClosure([])
	}


	module.exports = curry(function(object, property){
	    return hasOwn.call(object, property)
	})

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var getInstantiatorFunction = __webpack_require__(37)

	module.exports = function(fn, args){
		return getInstantiatorFunction(args.length)(fn, args)
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(){

	    'use strict'

	    var HAS_OWN       = Object.prototype.hasOwnProperty,
	        STR_OBJECT    = 'object',
	        STR_UNDEFINED = 'undefined'

	    return {

	        /**
	         * Copies all properties from source to destination
	         *
	         *      copy({name: 'jon',age:5}, this);
	         *      // => this will have the 'name' and 'age' properties set to 'jon' and 5 respectively
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         *
	         * @return {Object} destination
	         */
	        copy: __webpack_require__(31),

	        /**
	         * Copies all properties from source to destination, if the property does not exist into the destination
	         *
	         *      copyIf({name: 'jon',age:5}, {age:7})
	         *      // => { name: 'jon', age: 7}
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         *
	         * @return {Object} destination
	         */
	        copyIf: __webpack_require__(32),

	        /**
	         * Copies all properties from source to a new object, with the given value. This object is returned
	         *
	         *      copyAs({name: 'jon',age:5})
	         *      // => the resulting object will have the 'name' and 'age' properties set to 1
	         *
	         * @param {Object} source
	         * @param {Object/Number/String} [value=1]
	         *
	         * @return {Object} destination
	         */
	        copyAs: function(source, value){

	            var destination = {}

	            value = value || 1

	            if (source != null && typeof source === STR_OBJECT ){

	                for (var i in source) if ( HAS_OWN.call(source, i) ) {
	                    destination[i] = value
	                }

	            }

	            return destination
	        },

	        /**
	         * Copies all properties named in the list, from source to destination
	         *
	         *      copyList({name: 'jon',age:5, year: 2006}, {}, ['name','age'])
	         *      // => {name: 'jon', age: 5}
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         * @param {Array} list the array with the names of the properties to copy
	         *
	         * @return {Object} destination
	         */
	        copyList: __webpack_require__(33),

	        /**
	         * Copies all properties named in the list, from source to destination, if the property does not exist into the destination
	         *
	         *      copyListIf({name: 'jon',age:5, year: 2006}, {age: 10}, ['name','age'])
	         *      // => {name: 'jon', age: 10}
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         * @param {Array} list the array with the names of the properties to copy
	         *
	         * @return {Object} destination
	         */
	        copyListIf: __webpack_require__(34),

	        /**
	         * Copies all properties named in the namedKeys, from source to destination
	         *
	         *      copyKeys({name: 'jon',age:5, year: 2006, date: '2010/05/12'}, {}, {name:1 ,age: true, year: 'theYear'})
	         *      // => {name: 'jon', age: 5, theYear: 2006}
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         * @param {Object} namedKeys an object with keys denoting the properties to be copied
	         *
	         * @return {Object} destination
	         */
	        copyKeys: __webpack_require__(35),

	        /**
	         * Copies all properties named in the namedKeys, from source to destination,
	         * but only if the property does not already exist in the destination object
	         *
	         *      copyKeysIf({name: 'jon',age:5, year: 2006}, {aname: 'test'}, {name:'aname' ,age: true})
	         *      // => {aname: 'test', age: 5}
	         *
	         * @param {Object} source
	         * @param {Object} destination
	         * @param {Object} namedKeys an object with keys denoting the properties to be copied
	         *
	         * @return {Object} destination
	         */
	        copyKeysIf: __webpack_require__(36),

	        copyExceptKeys: function(source, destination, exceptKeys){
	            destination = destination || {}
	            exceptKeys  = exceptKeys  || {}

	            if (source != null && typeof source === STR_OBJECT ){

	                for (var i in source) if ( HAS_OWN.call(source, i) && !HAS_OWN.call(exceptKeys, i) ) {

	                    destination[i] = source[i]
	                }

	            }

	            return destination
	        },

	        /**
	         * Copies the named keys from source to destination.
	         * For the keys that are functions, copies the functions bound to the source
	         *
	         * @param  {Object} source      The source object
	         * @param  {Object} destination The target object
	         * @param  {Object} namedKeys   An object with the names of the keys to copy The values from the keys in this object
	         *                              need to be either numbers or booleans if you want to copy the property under the same name,
	         *                              or a string if you want to copy the property under a different name
	         * @return {Object}             Returns the destination object
	         */
	        bindCopyKeys: function(source, destination, namedKeys){
	            if (arguments.length == 2){
	                namedKeys = destination
	                destination = null
	            }

	            destination = destination || {}

	            if (
	                       source != null && typeof source    === STR_OBJECT &&
	                    namedKeys != null && typeof namedKeys === STR_OBJECT
	                ) {


	                var typeOfNamedProperty,
	                    namedPropertyValue,

	                    typeOfSourceProperty,
	                    propValue


	                for(var propName in namedKeys) if (HAS_OWN.call(namedKeys, propName)) {

	                    namedPropertyValue = namedKeys[propName]
	                    typeOfNamedProperty = typeof namedPropertyValue

	                    propValue = source[propName]
	                    typeOfSourceProperty = typeof propValue


	                    if ( typeOfSourceProperty !== STR_UNDEFINED ) {

	                        destination[
	                            typeOfNamedProperty == 'string'?
	                                            namedPropertyValue :
	                                            propName
	                            ] = typeOfSourceProperty == 'function' ?
	                                            propValue.bind(source):
	                                            propValue
	                    }
	                }
	            }

	            return destination
	        }
	    }

	}()

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(38)

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];

	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var HAS_OWN       = Object.prototype.hasOwnProperty
	var STR_OBJECT    = 'object'

	/**
	 * Copies all properties from source to destination
	 *
	 *      copy({name: 'jon',age:5}, this);
	 *      // => this will have the 'name' and 'age' properties set to 'jon' and 5 respectively
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination){

	    destination = destination || {}

	    if (source != null && typeof source === STR_OBJECT ){

	        for (var i in source) if ( HAS_OWN.call(source, i) ) {
	            destination[i] = source[i]
	        }

	    }

	    return destination
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var HAS_OWN       = Object.prototype.hasOwnProperty
	var STR_OBJECT    = 'object'
	var STR_UNDEFINED = 'undefined'

	/**
	 * Copies all properties from source to destination, if the property does not exist into the destination
	 *
	 *      copyIf({name: 'jon',age:5}, {age:7})
	 *      // => { name: 'jon', age: 7}
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination){
	    destination = destination || {}

	    if (source != null && typeof source === STR_OBJECT){

	        for (var i in source) if ( HAS_OWN.call(source, i) && (typeof destination[i] === STR_UNDEFINED) ) {

	            destination[i] = source[i]

	        }
	    }

	    return destination
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var STR_UNDEFINED = 'undefined'

	/**
	 * Copies all properties named in the list, from source to destination
	 *
	 *      copyList({name: 'jon',age:5, year: 2006}, {}, ['name','age'])
	 *      // => {name: 'jon', age: 5}
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 * @param {Array} list the array with the names of the properties to copy
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination, list){
	    if (arguments.length < 3){
	        list = destination
	        destination = null
	    }

	    destination = destination || {}
	    list        = list || Object.keys(source)

	    var i   = 0
	    var len = list.length
	    var propName

	    for ( ; i < len; i++ ){
	        propName = list[i]

	        if ( typeof source[propName] !== STR_UNDEFINED ) {
	            destination[list[i]] = source[list[i]]
	        }
	    }

	    return destination
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var STR_UNDEFINED = 'undefined'

	/**
	 * Copies all properties named in the list, from source to destination, if the property does not exist into the destination
	 *
	 *      copyListIf({name: 'jon',age:5, year: 2006}, {age: 10}, ['name','age'])
	 *      // => {name: 'jon', age: 10}
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 * @param {Array} list the array with the names of the properties to copy
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination, list){
	    if (arguments.length < 3){
	        list = destination
	        destination = null
	    }

	    destination = destination || {}
	    list        = list || Object.keys(source)

	    var i   = 0
	    var len = list.length
	    var propName

	    for ( ; i < len ; i++ ){
	        propName = list[i]
	        if (
	                (typeof source[propName]      !== STR_UNDEFINED) &&
	                (typeof destination[propName] === STR_UNDEFINED)
	            ){
	            destination[propName] = source[propName]
	        }
	    }

	    return destination
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var STR_UNDEFINED = 'undefined'
	var STR_OBJECT    = 'object'
	var HAS_OWN       = Object.prototype.hasOwnProperty

	var copyList = __webpack_require__(33)

	/**
	 * Copies all properties named in the namedKeys, from source to destination
	 *
	 *      copyKeys({name: 'jon',age:5, year: 2006, date: '2010/05/12'}, {}, {name:1 ,age: true, year: 'theYear'})
	 *      // => {name: 'jon', age: 5, theYear: 2006}
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 * @param {Object} namedKeys an object with keys denoting the properties to be copied
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination, namedKeys){
	    if (arguments.length < 3 ){
	        namedKeys = destination
	        destination = null
	    }

	    destination = destination || {}

	    if (!namedKeys || Array.isArray(namedKeys)){
	        return copyList(source, destination, namedKeys)
	    }

	    if (
	           source != null && typeof source    === STR_OBJECT &&
	        namedKeys != null && typeof namedKeys === STR_OBJECT
	    ) {
	        var typeOfNamedProperty
	        var namedPropertyValue

	        for  (var propName in namedKeys) if ( HAS_OWN.call(namedKeys, propName) ) {
	            namedPropertyValue  = namedKeys[propName]
	            typeOfNamedProperty = typeof namedPropertyValue

	            if (typeof source[propName] !== STR_UNDEFINED){
	                destination[typeOfNamedProperty == 'string'? namedPropertyValue : propName] = source[propName]
	            }
	        }
	    }

	    return destination
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var STR_UNDEFINED = 'undefined'
	var STR_OBJECT    = 'object'
	var HAS_OWN       = Object.prototype.hasOwnProperty

	var copyListIf = __webpack_require__(34)

	/**
	 * Copies all properties named in the namedKeys, from source to destination,
	 * but only if the property does not already exist in the destination object
	 *
	 *      copyKeysIf({name: 'jon',age:5, year: 2006}, {aname: 'test'}, {name:'aname' ,age: true})
	 *      // => {aname: 'test', age: 5}
	 *
	 * @param {Object} source
	 * @param {Object} destination
	 * @param {Object} namedKeys an object with keys denoting the properties to be copied
	 *
	 * @return {Object} destination
	 */
	module.exports = function(source, destination, namedKeys){
	    if (arguments.length < 3 ){
	        namedKeys = destination
	        destination = null
	    }

	    destination = destination || {}

	    if (!namedKeys || Array.isArray(namedKeys)){
	        return copyListIf(source, destination, namedKeys)
	    }

	    if (
	               source != null && typeof source    === STR_OBJECT &&
	            namedKeys != null && typeof namedKeys === STR_OBJECT
	        ) {

	            var typeOfNamedProperty
	            var namedPropertyValue
	            var newPropertyName

	            for (var propName in namedKeys) if ( HAS_OWN.call(namedKeys, propName) ) {

	                namedPropertyValue  = namedKeys[propName]
	                typeOfNamedProperty = typeof namedPropertyValue
	                newPropertyName     = typeOfNamedProperty == 'string'? namedPropertyValue : propName

	                if (
	                        typeof      source[propName]        !== STR_UNDEFINED &&
	                        typeof destination[newPropertyName] === STR_UNDEFINED
	                    ) {
	                    destination[newPropertyName] = source[propName]
	                }

	            }
	        }

	    return destination
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(){

	    'use strict';

	    var fns = {}

	    return function(len){

	        if ( ! fns [len ] ) {

	            var args = []
	            var i    = 0

	            for (; i < len; i++ ) {
	                args.push( 'a[' + i + ']')
	            }

	            fns[len] = new Function(
	                            'c',
	                            'a',
	                            'return new c(' + args.join(',') + ')'
	                        )
	        }

	        return fns[len]
	    }

	}()

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = {
	    'numeric'  : __webpack_require__(39),
	    'number'   : __webpack_require__(40),
	    'int'      : __webpack_require__(41),
	    'float'    : __webpack_require__(42),
	    'string'   : __webpack_require__(43),
	    'function' : __webpack_require__(44),
	    'object'   : __webpack_require__(45),
	    'arguments': __webpack_require__(46),
	    'boolean'  : __webpack_require__(47),
	    'date'     : __webpack_require__(48),
	    'regexp'   : __webpack_require__(49),
	    'array'    : __webpack_require__(50)
	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return !isNaN( parseFloat( value ) ) && isFinite( value )
	}

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value === 'number' && isFinite(value)
	}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var number = __webpack_require__(40)

	module.exports = function(value){
	    return number(value) && (value === parseInt(value, 10))
	}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var number = __webpack_require__(40)

	module.exports = function(value){
	    return number(value) && (value === parseFloat(value, 10)) && !(value === parseInt(value, 10))
	}

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value == 'string'
	}

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Function]'
	}

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Object]'
	}

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Arguments]' || !!value.callee
	}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return typeof value == 'boolean'
	}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object Date]'
	}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var objectToString = Object.prototype.toString

	module.exports = function(value){
	    return objectToString.apply(value) === '[object RegExp]'
	}

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = function(value){
	    return Array.isArray(value)
	}

/***/ }
/******/ ])
});
