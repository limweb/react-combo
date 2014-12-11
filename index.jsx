'use strict';

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


var VALUE = 'xxx'

var LEN = 10

var App = React.createClass({

    onChange: function(value){
        VALUE = value
        this.setState({})
    },

    handleFocus: function(){
        console.log('focused')
    },

    onKeyDown: function(){
        // console.log('key down')
    },

    render: function() {
        var data = gen(LEN)

        return (
            <div className="App" style={{padding: 10}}>
                <Combo
                    style={{
                        display: 'inline-block'
                    }}
                    readOnly={true}
                    idProperty      ='id'
                    displayProperty ='firstName'
                    data            ={data}
                    onFocus         ={this.handleFocus}
                    placeholder     ="test"
                    value           ={VALUE}
                    onChange        ={this.onChange}
                    onKeyDown        ={this.onKeyDown}
                />
            </div>
        )
    }
})

React.render(<App />, document.getElementById('content'))