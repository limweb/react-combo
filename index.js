import React from 'react'
import { render } from 'react-dom'

import Component from 'react-class'

import Combo, { List } from './src'

import './index.scss'

import gen from './generate'

let LEN = 20;

// var initialData = gen(LEN)

var initialData

// initialData = JSON.parse(localStorage.getItem('data'))

if (!initialData) {
  initialData = gen(LEN)

  // localStorage.setItem('data', JSON.stringify(initialData))
}

var data = initialData.concat()

const dataSource = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(data)
  }, 2000)
})


function renderItem(props){
  return <li {...props}>{props.data.lastName}!!!!</li>
}


let value = null

class App extends Component {
  onChange(v){
    value = v
    this.setState({})
  }
  render(){
    return <div className="app">
      <h1>React Combo</h1>

      <section>
        <h2>Simple Select</h2>
        <Combo
          multiSelect
          defaultValue={value}
          onChange={this.onChange}
          dataSource={data}
          listPosition="bottom"
          expandOnFocus={true}
        >
          <List 
            displayProperty="email" 
          />
        </Combo>
      </section>

      <section>
        <h2>Multiselect</h2>
        <Combo
          multiSelect
          defaultValue={value}
          onChange={this.onChange}
          dataSource={data}
          listPosition="bottom"
          expandOnFocus={true}
        >
          <List 
            displayProperty="email" 
          />
        </Combo>
      </section>
    </div>
  }
}

render(<App />, document.getElementById('content'))

