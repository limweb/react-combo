'use strict';

var React = require('react')
var Combo = require('./src')

require('./index.styl')

var VALUE = 'xxx'

var App = React.createClass({

    onChange: function(value){
        VALUE = value
        this.setState({})
    },

    render: function() {
        return (
            <div className="App" style={{padding: 10}}>
                <Combo placeholder="test" value={VALUE} onChange={this.onChange}/>
            </div>
        )
    }
})

React.render(<App />, document.getElementById('content'))