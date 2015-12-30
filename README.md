react-combo
===========

> A carefully crafted combo-box on steroids for React

## Install


```sh
$ npm i --save react-combo
```

## Usage

```jsx

import Combo from 'react-combo'
import 'react-combo/index.css'

const data = [
  { id: 1, label: 'First option' },
  { id: 2, label: 'Second' },
  { id: 3, label: 'Third' },
  { id: 4, label: 'Forth' }
]

<Combo
  data={data}
  idProperty="id"
  displayProperty="label"
  defaultValue={[1,2]}
/>
```

```jsx
import Combo, { List } from 'react-combo'
import 'react-combo/index.css'


<Combo
  data={data}
  idProperty="id"
  displayProperty="label"
  defaultValue={[1,2]}
>
  <List
    emptyText="No items here"
    loadingText={<span>loading</span>}
    listPosition="top"
  />
</Combo>
```

DON'T forget to import the styles from `react-combo/index.css`

## Behavior

Selected options can be navigated to with arrow keys and removed with `Delete` or `Backspace` or with click on remove icon.

## Properties

 * `dataSource: Array|Promise(Array)` - an array of items, or a promise resolving to an array.
 * `idProperty: String` - the name of the property to be used as an id for each item in the dataSource.
 * `displayProperty: String` - the name of the property to be displayed for each item in the dataSource
 * `value: String|Number|Array` - a single value, or an array of values, if you want to have multiselect
 * `onChange(value)` - the onChange callback. Will be called with a value or an array of values.
 * `renderItem(props)` - a function that can be used to customize how an item is rendered. If you return a React Node, the node will be rendered. If instead you only modify the props passed into this fn and return undefined, those props will be reflected on the default renderItem implementation
 * `renderTag(props)` - a function that can be used to customize how a selected item is rendered in the combo.
 * `tagClearTool` - specify false or null if you don't want to render a clear icon for selected items/tags.  

 ## Development

 ```sh
 $ git clone https://github.com/zippyui/react-combo.git
 $ npm i
 $ npm run dev
 ```

 Navigate to [http://localhost:9090/]

 ## License

 #### MIT