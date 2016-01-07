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

const tool = (props) => {
  props.children = props.expanded? 'a':'b'

}

class App extends Component {
  render(){
    return <div className="App" style={{padding: 10, marginTop: '60vh', height: 400}}>
      <input type="text" defaultValue="a test input" />
      <Combo
        multiSelect
        renderExpandTool={tool}
        displayProperty="lastName"
        defaultValue={null}
        dataSource={data}
      >
      </Combo>

      <input type="text" defaultValue="second input" />
    </div>
  }
}

render(<App />, document.getElementById('content'))
