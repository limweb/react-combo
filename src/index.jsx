'use strict';

var React  = require('react')
var Field  = require('react-input-field/src')
var ListView  = require('react-listview/src')
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

        showListOnFocus: React.PropTypes.bool
    },

    getInitialState: function(){
        return {
            listVisible: false,
            selectedIndex: -1
        }
    },

    getDefaultProps: function(){
        return {
            arrowColor: '#a8a8a8',
            arrowOverColor: '#7F7C7C',
            arrowWidth: 5,
            arrowHeight: 8,
            arrowPadding: 4,
            showListOnFocus: true
        }
    },

    render: function(){

        var props = this.prepareProps(this.props, this.state)

        return this.renderWith(props, this.state)
    },

    renderWith: function(props, state){


        var list = this.renderList(props.listProps, state)

        return <div {...this.prepareDivProps(props)}>
            <Field {...props.fieldProps}/>
            {list}
        </div>
    },

    renderList: function(listProps, state){
        if (!state.listVisible){
            return
        }

        return <ListView {...listProps} />
    },

    prepareListProps: function(props, state){
        var listProps  = assign({}, props.listProps)
        var data       = props.data || listProps.data
        var idProperty = props.idProperty || listProps.idProperty
        var selected

        if (~state.selectedIndex){
            var item = data[state.selectedIndex]

            if (item){
                selected = {}
                selected[item[idProperty]] = true
            }
        }

        if (selected){
            listProps.selected = selected
        }

        listProps.data            = data
        listProps.idProperty      = idProperty
        listProps.displayProperty = props.displayProperty || listProps.displayProperty

        return listProps
    },

    prepareDivProps: function(props){
        delete props.data
        return props
    },

    prepareFieldProps: function(props){
        var fieldProps = assign({}, props)

        delete fieldProps.style

        fieldProps.ref = 'field'
        fieldProps.onFocus = this.handleFocus
        fieldProps.onBlur  = this.handleBlur
        fieldProps.onKeyDown = this.handleKeyDown.bind(this, props)
        fieldProps.onChange = this.handleChange.bind(this, props)

        delete fieldProps.data

        return fieldProps
    },

    prepareProps: function(thisProps, state){
        var props = {}

        assign(props, thisProps)

        props.tools = props.tools || this.renderTools

        var listProps  = props.listProps  = this.prepareListProps(props, state)
        var fieldProps = props.fieldProps = this.prepareFieldProps(props, state)

        var displayValue = props.displayValue
        var index        = this.getIndexForValue(props.value, props)

        if (typeof displayValue == 'undefined'){
            displayValue = this.getDisplayPropertyAt(index, props) || props.value
        }

        props.selectedIndex = index
        fieldProps.value = displayValue

        return props
    },

    getIndexForValue: function(value, props){
        var listProps       = props.listProps
        var idProperty      = listProps.idProperty
        var data            = listProps.data

        return findIndexBy(function(item){
            if (item && item[idProperty] === value){
                return true
            }
        }, listProps.data)
    },

    getItemAt: function(index, props){
        return props.listProps.data[index]
    },

    getDisplayPropertyAt: function(index, props){
        var result = this.getPropertyAt(props.listProps.displayProperty, index, props)

        return typeof result != 'undefined'?
                    result:
                    ''
    },

    getIdPropertyAt: function(index, props){
        return this.getPropertyAt(props.listProps.idProperty, index, props)
    },

    getPropertyAt: function(propertyName, index, props){
        var item = this.getItemAt(index, props)

        return item?
                item[propertyName]:
                undefined
    },

    getDisplayValueForValue: function(value, props){
        var displayProperty = props.listProps.displayProperty
        var index = this.getIndexForValue(value, props)
        var data = props.listProps.data

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
        if (this.isListVisible()){
            var index = this.getIndexForValue(value, props)

            if (!~index){
                this.setState({
                    selectedIndex: -1
                })
            }

        }

        ;(this.props.onChange || emptyFn)(value, this, event);
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

    handleArrowClick: function(event){
        this.toggleList()
    },

    handleArrowMouseDown: function(event){
    },

    handleKeyDown: function(props, event){
        var key = event.key
        var fn = 'handle' + toUpperFirst(key) + 'KeyDown'

        if (this[fn]){
            this[fn](props, event)
        }
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
        if (this.isListVisible()){
            var data = props.listProps.data
            var item = data[this.state.selectedIndex]
            var displayProperty = props.listProps.displayProperty
            var idProperty = props.listProps.idProperty
            var text = ''
            var id

            if (item){
                text = item[displayProperty]
                id = item[idProperty]
            }

            this.notify(id)

            this.setListVisible(false)
        }
    },

    onArrowNavigation: function(props, dir){
        if (this.isListVisible()){

            var state         = this.state
            var selectedIndex = state.selectedIndex
            var nextIndex     = selectedIndex + dir
            var data          = props.listProps.data

            if (nextIndex >= data.length){
                nextIndex = 0
            }
            if (nextIndex < 0){
                nextIndex = data.length - 1
            }

            this.setState({
                selectedIndex: nextIndex
            })
        } else {
            this.setState({
                selectedIndex: props.selectedIndex
            })
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