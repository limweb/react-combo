import React from 'react'
import { render } from 'react-dom'

import Component from 'react-class'

import Combo, { List } from './src'

import './index.scss'

import gen from './generate'

let LEN = 20;

var initialData = gen(LEN)
var data = initialData.concat()

const dataSource = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(data)
  }, 2000)
})


function renderItem(props){
  return <li {...props}>{props.data.lastName}!!!!</li>
}

class App extends Component {
  render(){
    return <div className="App" style={{padding: 10, marginTop: '60vh', height: 400}}>
      <input type="text" defaultValue="a test input" />

      <Combo multiSelect listPosition="top" xrenderItem={renderItem} displayProperty="lastName" defaultValue={null} dataSource={data} focusedClassName="focused">
      </Combo>

      <input type="text" defaultValue="second input" />
    </div>
  }
}

render(<App />, document.getElementById('content'))
