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

class App extends Component {
  render(){
    return <div className="App" style={{padding: 10, height: 400}}>
      <input type="text" defaultValue="a" />

      <Combo displayProperty="lastName" value={[4, 3, 14]} dataSource={data} focusedClassName="focused" dropdown>
        <List

          currentIndex={1}
        />
      </Combo>

      <input type="text" defaultValue="b" />
    </div>
  }
}

render(<App />, document.getElementById('content'))
