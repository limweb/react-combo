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

var LEN = 100
var initial = true

var initialData = gen(LEN)
var data = initialData.concat()

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
        console.log('select', text, value)
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
            VALUE = data[3].id
        }

        var v = VALUE

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

        return (
            <div className="App" style={{padding: 10, height: 200}}>
                <Combo
                    style={{
                        display: 'inline-block'
                        // ,
                        // top: 500
                    }}
                    idProperty      ='id'
                    displayProperty ='firstName'
                    data            ={data}
                    statefulx={true}
                    clearTool={true}
                    onFocus         ={this.handleFocus}
                    placeholder     ="test"
                    value           ={v}
                    hiddenName           ={'v.id'}
                    displayValuex    ={v.display}
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