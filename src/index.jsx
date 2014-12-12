'use strict';

var React  = require('react')
var Field  = require('react-input-field/src')
var ListView  = require('react-listview/src')
var ListViewFactory  = React.createFactory(ListView)
var assign = require('object-assign')

function toUpperFirst(str){
    if (!str){
        return str
    }

    return str.charAt(0).toUpperCase() + str.substring(1)
}

function arrowStyle(side, props){

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

function findIndexBy(fn, data){

    var i = 0
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

function emptyFn(){}

var stringOrNumber = React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
])

module.exports = React.createClass({

    displayName: 'ReactCombo',

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

        listStyle : React.PropTypes.object,
        listProps : React.PropTypes.object,

        fieldStyle: React.PropTypes.object,
        fieldProps: React.PropTypes.object,

        filterFn: React.PropTypes.func,
        value: React.PropTypes.any,
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

        listFactory: React.PropTypes.func
    },

    filterBy: function(value, arr, displayProperty) {

        value = (value + '').toLowerCase()

        return arr.filter(function(item){
            var prop = (item[displayProperty] + '').toLowerCase()

            return prop.indexOf(value) === 0
        })
    },

    getInitialState: function(){
        return {
            listVisible : false,
            selectedId  : undefined,
            filterValue : undefined
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
            hiddenName: ''
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
                            <input type="hidden" value={props.value} name={props.hiddenName}/>:
                            null

        return <div {...this.prepareDivProps(props)}>
            {hiddenField}
            <Field {...props.fieldProps}/>
            {list}
        </div>
    },

    renderList: function(props, state){
        var listProps = props.listProps

        if (!state.listVisible){
            listProps.style.display = 'none'
        }

        return (props.listFactory || ListViewFactory)(listProps)
    },

    prepareSelected: function(props, state) {
        var listProps  = props.listProps
        var data       = listProps.data
        var idProperty = listProps.idProperty
        var selected
        var selectedId = typeof state.selectedId == 'undefined'?
                                props.selectedId:
                                state.selectedId

        if (typeof selectedId != 'undefined'){

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
        listProps.onRowClick      = this.handleListRowClick.bind(this, props)

        listProps.style = assign({}, props.listStyle, listProps.style)

        listProps.rowStyle = assign({
            cursor: 'pointer'
        }, listProps.rowStyle)

        return listProps
    },

    prepareDivProps: function(props){

        var divProps = assign({}, props)

        delete divProps.data
        delete divProps.value
        delete divProps.placeholder

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

        fieldProps.style = assign({}, props.fieldStyle, fieldProps.style)
        fieldProps.ref = 'field'
        fieldProps.onFocus   = this.handleFocus
        fieldProps.onBlur    = this.handleBlur
        fieldProps.onKeyDown = this.handleKeyDown.bind(this, props)
        fieldProps.onChange  = this.handleChange.bind(this, props)
        fieldProps.onSelect  = this.handleSelect.bind(this, props)

        delete fieldProps.data

        return fieldProps
    },

    prepareData: function(props, state){
        var listProps       = props.listProps
        var displayProperty = listProps.displayProperty

        var data = state.data || props.data || listProps.data
        var isArray = Array.isArray(data)

        if (isArray && this.isStatefulFiltering(props) && state.filterValue != null && state.filterValue !== ''){
            data = (props.filterFn || this.filterBy)(state.filterValue, data, displayProperty)
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

        var displayValue = props.displayValue
        var index        = this.getIndexForValue(props.value, props)

        if (typeof displayValue == 'undefined'){
            displayValue = this.getDisplayPropertyAt(index, props) || props.value
        }

        fieldProps.value = displayValue

        //------ props.selectedId
        props.selectedId = this.getIdPropertyAt(index, props)

        //------ listProps.selected
        var selected  = this.prepareSelected(props, state)

        if (selected){
            listProps.selected = selected
        }

        props.className = this.prepareClassName(props)
        props.style = this.prepareStyle(props)

        return props
    },

    prepareClassName: function(props){
        var className = props.className || ''

        className += ' z-combo'

        if (props.readOnly){
            className += ' z-read-only'
        }

        return className
    },

    prepareStyle: function (props) {
        var style = assign({}, props.defaultStyle, props.style)

        return style
    },

    getIndexForValue: function(value, props, data){
        var listProps       = props.listProps
        var idProperty      = listProps.idProperty
        data = data || listProps.data

        return findIndexBy(function(item){
            if (item && item[idProperty] === value){
                return true
            }
        }, listProps.data)
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

        return <div style={style}
                className={className}
                onMouseOut={this.handleArrowMouseOut}
                onMouseOver={this.handleArrowMouseOver}
                onClick={this.handleArrowClick}
                onMouseDown={this.handleArrowMouseDown}>
            <div className="combo-arrow" style={comboArrowStyle} />
        </div>
    },

    handleChange: function(props, value, event){

        var index       = this.getIndexForValue(value, props)
        var selectedId  = this.getIdPropertyAt(index, props)
        var filterValue = props.readOnly?
                            null:
                            value

        this.setState({
            selectedId : selectedId
        })

        this.setListVisible(true)

        var item
        var data
        var info = {
            event: event
        }

        if (~index){
            data          = props.listProps.data
            item          = data[index]
            info.selected = item
            info.index    = index
            value         = this.getDisplayPropertyAt(index, props)
        }

        if (!props.readOnly || ~index){
            ;(this.props.onChange || emptyFn)(value, info);
        }

        if (~index){

            this.onSelect(props, value, item, index)
        }

        this.doFilter(filterValue)
    },

    onSelect: function(props, value, item, index) {
        ;(this.props.onSelect || emptyFn)(value, item, index)
    },

    doFilter: function(filterValue){
        this.setState({
            filterValue: filterValue
        })

        ;(this.props.onFilter || emptyFn)(filterValue)
    },

    handleSelect: function() {},

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

    handleArrowMouseDown: function(){
    },

    handleKeyDown: function(props, event){
        var key = event.key
        var fn = 'handle' + toUpperFirst(key) + 'KeyDown'

        if (this[fn]){
            this[fn](props, event)
        }
    },

    handleListRowClick: function(props, item, index) {
        this.setState({
            skipShowOnFocus: true
        })
        this.confirm(props, index)
        this.focus()
    },

    handleEscapeKeyDown: function(props, event){
        this.setListVisible(false)
    },

    handleArrowDownKeyDown: function(props, event){
        this.setListVisible(true)

        this.onArrowNavigation(props, 1)
    },

    handleArrowUpKeyDown: function(props, event){
        this.setListVisible(true)

        this.onArrowNavigation(props, -1)
    },

    handleEnterKeyDown: function(props, event){
        this.confirm(props)
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

            this.notify(id)

            this.setListVisible(false)
        }
    },

    onArrowNavigation: function(props, dir){
        if (this.isListVisible()){

            var state      = this.state
            var selectedId = typeof state.selectedId === 'undefined'?
                                    props.selectedId:
                                    state.selectedId
            var selectedIndex = this.getIndexForValue(selectedId, props)
            var nextIndex     = selectedIndex + dir
            var data          = props.listProps.data

            if (nextIndex >= data.length){
                nextIndex = 0
            }
            if (nextIndex < 0){
                nextIndex = data.length - 1
            }

            selectedId = this.getIdPropertyAt(nextIndex, props)

            this.setState({
                selectedId: selectedId
            })
        } else {
            this.setState({
                selectedId: props.selectedId
            })
            this.doFilter(null)
        }
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
        var visible = !this.state.listVisible

        var state   = {
            listVisible: visible
        }

        if (!visible){
            state.skipShowOnFocus = true
        }

        this.setState(state)

    },

    isFocused: function(){
        return this.refs.field.isFocused()
    },

    getInput: function(){
        return this.refs.field.getInput()
    },

    focus: function(){
        this.refs.field.focus()
    },

    notify: function(value, event) {
        this.refs.field.notify(value, event)
    },

    handleFocus: function(){
        if (this.props.showListOnFocus){
            this.setListVisible(true)
            this.doFilter(null)
        }
    },

    handleBlur: function() {

        setTimeout(function(){
            var state = {
                skipShowOnFocus: null
            }

            state.listVisible = this.isFocused() && !this.state.skipShowOnFocus

            this.setState(state)
        }.bind(this), 100)

    }

})