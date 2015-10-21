'use strict';

var React  = require('react')
var assign = require('object-assign')
var prefixer = require('react-style-normalizer')
var Field  = require('react-input-field/src')
var TagField  = require('react-tag-editor/src')
var buffer = require('buffer-function')

var EVENT_NAMES = require('react-event-names')

var ListView        = require('react-listview/src')
var ListViewFactory = React.createFactory(ListView)

var arrowStyle   = require('./arrowStyle')
var toUpperFirst = require('./toUpperFirst')
var findIndexBy  = require('./findIndexBy')
var FILTER_BY    = require('./filterBy')

function emptyFn(){}

var stringOrNumber = React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
])

var Utils = require('react-field-component-utils')

module.exports = React.createClass({

    displayName: 'ReactCombo',

    mixins: [
        Utils,
        require('./ConstrainListMixin')
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
        dd             : React.PropTypes.bool,

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

        onSelect  : React.PropTypes.func,
        onChange  : React.PropTypes.func,
        onFilter  : React.PropTypes.func,
        onShowList: React.PropTypes.func,
        validate  : React.PropTypes.func,

        listFactory  : React.PropTypes.func,
        renderList   : React.PropTypes.func,
        constrainList: React.PropTypes.func
    },

    filterBy: FILTER_BY,

    getInitialState: function(){
        return {
            listVisible             : false,
            defaultSelected         : this.props.defaultSelected,
            selectedId              : undefined,
            lastSelectedId          : undefined,
            lastSelectedDisplayValue: undefined,
            filterValue             : undefined
        }
    },

    getDefaultProps: function(){
        return {
            defaultStyle: {
                position: 'relative',
                display: 'inline-block',
                boxSizing: 'border-box'
            },
            defaultFieldStyle: {
                overflow: 'visible',
                width: '100%',
                position: 'relative'
            },
            defaultDisabledStyle: null,
            defaultDisabledFieldStyle: {
                background: 'rgb(235, 235, 228)'
            },
            dropDownInputStyle: {
                background: 'white'
            },
            defaultFieldProps: {
                selectableTags: true,
                innerStyle: {
                    overflow: 'hidden'
                }
            },
            activeRowStyle: {
                background: '#e1edff'
            },
            arrowColor: '#a8a8a8',
            arrowOverColor: '#7F7C7C',
            arrowWidth: 5,
            arrowHeight: 8,
            arrowPadding: 4,
            showListOnFocus  : true,
            stateful: true,
            loading : false,
            multiSelect: false,
            listPosition: 'bottom',
            hiddenName: '',
            constrainTo: true,
            forceSelect: false,
            updateOnNavigate: false,
            defaultListStyle: {
                border: '1px solid #a8a8a8',
                background: 'white',
                boxSizing: 'border-box',
                zIndex  : 1,
                position: 'absolute',
                left: 0,
                right: 0,
                top: '100%'
            }
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
                            <input type="hidden" value={this.getValue(props, state)} name={props.hiddenName}/>:
                            null

        var FieldFactory = props.multiSelect?
                            TagField:
                            Field
        return <div {...this.prepareWrapperProps(props, state)}>
            {hiddenField}
            <FieldFactory {...props.fieldProps}>
                {list}
            </FieldFactory>

        </div>
    },

    renderList: function(props, state){
        var listProps = props.listProps
        var visible   = state.listVisible

        listProps.visible = visible

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

    setSelected: function(props, selectedMap){

        if (this.props.selected == null){
            this.setState({
                defaultSelected: selectedMap
            })
        }

        var listProps = this.props.listProps || {}

        ;(listProps.onSelectionChange || emptyFn)(selectedMap)
        ;(this.props.onSelectionChange || emptyFn)(selectedMap)

    },

    getSelectedId: function(props, state){
        if (props.multiSelect){
            var selected = props.selected == null?
                            state.defaultSelected:
                            props.selected

            if (selected && typeof selected == 'object'){
                return Object.keys(selected)[0]
            }
        }

        return state.selectedId === undefined?
                                props.selectedId:
                                state.selectedId

    },

    prepareSelected: function(props, state) {

        var selected
        if (props.multiSelect){
            selected = props.selected == null?
                        state.defaultSelected:
                        props.selected

            if (selected && typeof selected == 'object'){
                return selected
            }
        }

        var selectedId = this.getSelectedId(props, state)

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

        listProps.onRowMouseDown    = this.handleListRowMouseDown.bind(this, props)
        listProps.onSelectionChange = this.handleListSelectionChange.bind(this, props)

        listProps.style = assign({}, props.defaultListStyle, props.listStyle, listProps.style)

        listProps.rowStyle = this.rowStyle.bind(this, props, state, listProps)

        listProps.ref = "list"

        return listProps
    },

    rowStyle: function(props, state, listProps, item, index, rowProps) {
        var activeStyle

        if (props.selectedId === item[listProps.idProperty]){
            activeStyle = props.activeRowStyle
        }

        var style = assign({
                    cursor: 'pointer'
                }, listProps.rowStyle, activeStyle)

        return style
    },

    prepareWrapperProps: function(props, state){

        var wrapperProps = this._prepareWrapperProps(props, state)

        wrapperProps['data-value'] = this.getValue(props, state)
        wrapperProps.onMouseDown = this.handleMouseDown

        return wrapperProps
    },

    handleMouseDown: function(event) {
        ;(this.props.onMouseDown || emptyFn)(event)

        if (this.props.dd){
            this.toggleList()
        }
    },

    prepareFieldProps: function(props){
        var fieldProps = assign({}, props)

        delete fieldProps.fieldProps
        delete fieldProps.style
        delete fieldProps.defaultStyle
        delete fieldProps.readOnly

        assign(fieldProps, props.defaultFieldProps, props.fieldProps)

        var ddStyle
        if (props.dd){
            fieldProps.disabled = true
            ddStyle = props.dropDownInputStyle
        }

        fieldProps.inputProps = assign({}, fieldProps.inputProps)
        fieldProps.inputProps.size = null
        fieldProps.inputProps.style = assign({}, fieldProps.inputProps.style, { flex: 1 })

        if (props.readOnly){
            fieldProps.inputProps.style = assign({
                cursor: 'pointer'
            }, ddStyle, fieldProps.inputProps.style)
        }

        fieldProps.ref = 'field'

        var disabled1Style
        var disabled2Style
        var disabled3Style

        if (props.disabled){
            disabled1Style = props.defaultDisabledFieldStyle
            disabled2Style = props.disabledFieldStyle
        }

        fieldProps.style     = assign({}, props.defaultFieldStyle, disabled1Style, props.fieldStyle, disabled2Style, fieldProps.style)
        fieldProps.onFocus   = this.handleFocus.bind(this, props)
        fieldProps.onBlur    = this.handleBlur
        fieldProps.onKeyDown = this.handleKeyDown.bind(this, props)
        fieldProps.onChange  = this.handleChange.bind(this, props)

        if (props.multiSelect){
            fieldProps.onChangeTags = this.handleChangeTags.bind(this, props)
        }

        delete fieldProps.data

        return fieldProps
    },

    prepareData: function(props, state){
        var listProps       = props.listProps
        var displayProperty = listProps.displayProperty
        var idProperty = listProps.idProperty

        var data    = state.data || props.data || listProps.data
        var isArray = Array.isArray(data)
        var filteredData = data
        var filterOutSelected = !!(props.selected && props.multiSelect && props.filterOutSelected)
        var shouldFilter = state.filterValue != null && state.filterValue !== ''

        if (isArray && this.isStatefulFiltering(props) && (shouldFilter || filterOutSelected)){
            if (shouldFilter){
                filteredData = (props.filterFn || this.filterBy)(state.filterValue, data, displayProperty) || data
            }

            if (filterOutSelected){
                var selected = props.selected
                filteredData = filteredData.filter(function(item){
                    return !(item[idProperty] in selected)
                }) || data
            }

            data = filteredData
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

    prepareTagInfo: function(props, state){

        var listProps = props.listProps
        var displayProperty = listProps.displayProperty
        var idProperty = listProps.idProperty

        var selected = props.selected
        var info = []

        if (selected){
            Object.keys(selected).forEach(function(key){
                var item = selected[key]

                if (item){
                    info.push({
                        id: item[idProperty],
                        item: item,
                        text: item[displayProperty]
                    })
                }
            })
        }

        return info
    },

    prepareTags: function(props, state){
        props.tagInfo = this.prepareTagInfo(props, state)

        return props.tagInfo.map(function(info){
            return info.text
        })
    },

    prepareProps: function(thisProps, state){
        var props = {}

        assign(props, thisProps)

        props.multiSelect = false

        //----- prepare tools
        props.tools = props.tools || this.renderTools

        var selected  = this.prepareSelected(props, state)

        if (selected){
            props.selected = selected
        }

        //----- listProps
        var listProps = props.listProps  = this.prepareListProps(props, state)

        props.data = props.listProps.data = this.prepareData(props, state)

        if (props.dd){
            props.forceSelect = true
            props.readOnly    = true
            props.clearTool   = false
        }

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

        if (selected){
            listProps.selected = selected
        }

        var selectedId = this.getSelectedId(props, state)
        var selectedIndex

        if (selectedId != null){
            props.selectedId = selectedId
            if (props.forceSelect && typeof state.lastSelectedDisplayValue === 'undefined'){
                selectedIndex = this.getIndexForValue(selectedId, props)
                this.lastSelectedDisplayValue = this.getDisplayPropertyAt(selectedIndex, props)
            }

            if (!props.multiSelect){
                setTimeout(function(){
                    this.scrollToRowById(selectedId)
                }.bind(this), 0)
            }
        }

        fieldProps.value = displayValue

        if (props.multiSelect){
            fieldProps.tags = this.prepareTags(props, state)
        }

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
        var defaultDisabledStyle
        var disabledStyle

        if (props.disabled){
            defaultDisabledStyle = props.defaultDisabledStyle
            disabledStyle = props.disabledStyle
        }

        var style = assign({}, props.defaultStyle, defaultDisabledStyle, props.style, disabledStyle)

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

        var disabled     = props.disabled
        var state        = this.state
        var arrowProps   = assign({}, props)
        var arrowPadding = props.arrowPadding

        var style = {
            padding   : '0px ' + arrowPadding + 'px',
            position  : 'relative',
            display   : 'flex',
            flexFlow  : 'row',
            alignItems: 'center'
        }

        if (!disabled){
            style.cursor = 'pointer'
        }

        var className = 'combo-tool'

        if (state && state.arrowToolOver && !disabled){
            className += ' combo-tool-over'
            arrowProps.arrowColor = props.arrowOverColor || arrowProps.arrowColor
        }

        var comboArrowStyle = arrowStyle('down', arrowProps)

        var events = {
            onMouseOut: this.handleArrowMouseOut,
            onMouseOver: this.handleArrowMouseOver,
        }

        events[EVENT_NAMES.onClick]     = this.handleArrowClick
        events[EVENT_NAMES.onMouseDown] = this.handleArrowMouseDown

        return <div style={prefixer(style)}
                key="comboTool"
                ref="comboTool"
                className={className}
                {...events}
            >
            <div className="combo-arrow" style={comboArrowStyle} />
        </div>
    },

    handleChangeTags: function(props, tags){
        var selected = props.selected
        var newSelected = {}
        var displayProperty = props.listProps.displayProperty

        var tagInfo = props.tagInfo

        tags.forEach(function(text){

            var index = findIndexBy(function(item){
                return item.text === text
            }, tagInfo)

            var id

            if (~index){
                id = tagInfo[index].id
                newSelected[id] = selected[id]
            }
        })

        this.setSelected(props, newSelected)

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

        this.doFilter(filterValue, props)
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

    doFilter: function(filterValue, props){
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

            if (!props.multiSelect){
                this.setListVisible(false)
            }
        }
    },

    onArrowNavigation: buffer(function(props, dir){

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
            this.doFilter(null, props)
        }
    }, 10),

    handleArrowMouseOver: function(){
        if (this.props.disabled){
            return
        }
        this.setState({
            arrowToolOver: true
        })
    },

    handleArrowMouseOut: function(){
        if (this.props.disabled){
            return
        }

        this.setState({
            arrowToolOver: false
        })
    },

    handleArrowClick: function(){
    },

    handleArrowMouseDown: function(event){
        event.preventDefault()
        this.toggleList()
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

        if (props.multiSelect){
            return
        }

        this.confirm(props, index)
    },

    handleListSelectionChange: function(props, selectedMap){
        if (!props.multiSelect){
            return
        }

        this.setSelected(props, selectedMap)
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

            if (this.props.dd){

                if (value) {
                    setTimeout(function(){
                        window.addEventListener('mousedown', this.onWindowMouseDown)
                    }.bind(this), 1)
                } else {
                    window.removeEventListener('mousedown', this.onWindowMouseDown)
                }
            }
        }
    },

    onWindowMouseDown: function(){
        this.setListVisible(false)
        window.removeEventListener('mousedown', this.onWindowMouseDown)
    },

    toggleList: function(){
        if (this.props.disabled){
            return
        }

        this.setListVisible(!this.state.listVisible)
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

    handleFocus: function(props, event){
        if (this.props.showListOnFocus && !this.props.dd){
            this.setListVisible(true)
            this.doFilter(null, props)
        }

        var fieldProps = this.props.fieldProps

        if (fieldProps && fieldProps.onFocus){
            fieldProps.onFocus(event)
        }

        if (this.props.onFocus){
            this.props.onFocus(event)
        }
    },

    handleBlur: function(event) {

        var props = this.props
        var state = this.state

        if (props.forceSelect){

            var id    = state.lastSelectedId
            var value = this.getValue(props, state)

            if (id !== value && id != null){
                this.selectId(id)
            }
        }

        this.setListVisible(false)

        var fieldProps = props.fieldProps

        if (fieldProps && fieldProps.onBlur){
            fieldProps.onBlur(event)
        }
    }
})