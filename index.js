import React from 'react'
import { render } from 'react-dom'

import Component from 'react-class'

import Combo from './src'

import './index.scss'

import gen from './generate'

let LEN = 100;

var initialData = gen(LEN)
var data = initialData.concat()

class App extends Component {
  render(){
    return <div className="App" style={{padding: 10, height: 400}}>
      <input type="text" defaultValue="a" />
      <Combo
        dataSource={initialData}
        displayProperty="lastName"
        focusedClassName="focused"
      />
      <input type="text" defaultValue="b" />
    </div>
  }
}

render(<App />, document.getElementById('content'))
