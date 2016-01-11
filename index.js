import React from 'react'
import { render } from 'react-dom'

import Component from 'react-class'

import Combo, { List } from './src'

import './index.scss'

import gen from './generate'

let LEN = 20;

var initialData = gen(LEN)
var data = initialData.concat()

console.log(data)
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

const renderTag = (props) => {
}

let value = null

class App extends Component {
  onChange(v){
    value = v
    this.setState({})
  }
  render(){
    return <div className="App" style={{padding: 10, marginTop: '6vh', height: 40}}>
      <input type="text" defaultValue="a test input" />
      {JSON.stringify(value)}
      <Combo
        renderTag={renderTag}
        multiSelect
        expanded
        renderExpandTool={tool}
        defaultValue={value}
        idProperty={x=> x.id+'!'}
        onChange={this.onChange}
        dataSource={data}
      >
        <List displayProperty="email" />
      </Combo>

      <input type="text" defaultValue="second input" />
    </div>
  }
}

render(<App />, document.getElementById('content'))

