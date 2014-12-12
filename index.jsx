'use strict';

require('es6-promise').polyfill()
require('fetch')

var React = require('react')
var Combo = require('./src')

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
                id       : i + 1,
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

var LEN = 20
var initial = true

var initialData = gen(LEN)
var data = initialData.concat()

var App = React.createClass({

    onChange: function(value, info){
        VALUE.display = value

        VALUE.id = info.selected?
                    info.selected.id:
                    ''

        this.setState({})

        // console.log('change: ', value)
    },

    onSelect: function(value, item) {
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
            VALUE = {
                id: data[3].id,
                display: data[3].firstName
            }
        }

        var v = VALUE

        initial = false

        var d = data
        // data = new Promise(function(accept, reject){
        //     setTimeout(function(){
        //         accept(d)
        //     }, 3000)
        // })

        var listStyle = {
            minHeight: 300,
            border: '1px solid gray'
        }

        return (
            <div className="App" style={{padding: 10}}>
                <Combo
                    style={{
                        display: 'inline-block'
                    }}
                    idProperty      ='id'
                    displayProperty ='firstName'
                    data            ={data}
                    statefulx={true}
                    clearTool={true}
                    onFocus         ={this.handleFocus}
                    placeholder     ="test"
                    value           ={v.id}
                    hiddenName           ={'v.id'}
                    displayValue    ={v.display}
                    onChange        ={this.onChange}
                    onSelect        ={this.onSelect}
                    onFilterx        ={this.onFilter}
                    onKeyDown        ={this.onKeyDown}
                    listStyle={listStyle}
                />
            </div>
        )
    }
})

React.render(<App />, document.getElementById('content'))