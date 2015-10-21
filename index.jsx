'use strict';

// require('es6-promise').polyfill()
// require('fetch')

var React = require('react')
var Combo = require('./src')
var ListView = require('react-listview/src')

require('./index.styl')

var faker = require('faker');

var gen = (function(){

    var cache = {}

    return function(len){

        if (cache[len]){
            return cache[len]
        }

        var arr = []

        for (var i = 0; i < len; i++){
            arr.push({
                id       : i,
                grade      : Math.round(Math.random() * 10),
                email    : faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName : faker.name.lastName(),
                birthDate: faker.date.past()
            })
        }

        cache[len] = arr

        return arr
    }
})()


var VALUE = {}

var LEN = 100
var initial = true
var selected = {}

var initialData = gen(LEN)
var data = initialData.concat()

function log(){
    // console.log(arguments)
}

var App = React.createClass({

    onChange: function(text, value, info){
        VALUE = value
        // console.log('TEXT:', text, ', VALUE:',value)
        // VALUE.display = text
        // VALUE.id = value



        // if (info.selected){
        //     VALUE = info.selected.id
        // }
        // VALUE.id = info.selected?
        //             info.selected.id:
        //             ''

        this.setState({})

        // console.log('change: ', value)
    },

    onSelect: function(text, value, item) {
        // console.log('select', text, value)
        // VALUE = {

        // }
        // this.setState({})
        // console.log(item)
    },

    handleFocus: function(){

    },

    onKeyDown: function(){
        // console.log('key down')
    },

    onFilter: function(value) {

        if (!value){
            data = initialData
        } else {

            data = initialData.filter(function(item){
                return item.firstName.toLowerCase().indexOf(value.toLowerCase()) === 0
            })
        }

        this.setState({})
    },

    render: function() {



        if (initial){
            selected[data[18].id] = data[18]
            selected[data[20].id] = data[20]
            VALUE = data[30].id
        }

        var v = VALUE

        var listProps = {
            rowFactory: function(props){
                return <li {...props} />
            }
        }

        initial = false

        var d = data
        // data = new Promise(function(accept, reject){
        //     setTimeout(function(){
        //         accept(d)
        //     }, 1)
        // })

        var listStyle = {
            border: '1px solid gray'
        }

        var fp = {
            style: {
                // border: '2px solid red'
            }
        }

        function f(filterValue, data){}

        function onClick(e){
            console.log('clicked', e.target)
        }

        // console.log(v)

        return (
            <div>
            <div className="App" style={{padding: 10, height: 400}}>
                <Combo
                    style={{

                        padding: 20,
                        width: 400
                        // ,
                        // top: 500
                    }}
                    constrainTo     ={'.App'}
                    idProperty      ='id'
                    displayProperty ='firstName'
                    data            ={data}
                    readOnly       ={false}
                    forceSelect     ={true}
                    defaultSelected={selected}
                    xmultiSelect     ={true}
                    xfilterOutSelected={true}
                    updateOnNavigate={true}
                    placeholder     ="test"
                    value    ={v}

                    Xstateful={true}
                    XonFocus         ={this.handleFocus}
                    XhiddenName           ={'v.id'}
                    XdisplayValue    ={v.display}
                    onChange        ={this.onChange}
                    XonSelect        ={this.onSelect}
                    XonFilter        ={this.onFilter}
                    XonKeyDown        ={this.onKeyDown}
                    listProps={listProps}
                    listStyle={listStyle}
                    fieldProps={fp}
                />

            </div>
                <input placeholder="email"/>
                <input placeholder="text"/>
                <ListView data={data} idProperty='id' displayProperty='firstName'
                style={{width: 300, height: 400}}
                onRowClick={log}
                />
            </div>
        )
    }
})

React.render(<App />, document.getElementById('content'))