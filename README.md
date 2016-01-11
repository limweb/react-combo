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
 * `idProperty: String|Function` - the name of the property to be used as an id for each item in the dataSource. If the idProperty is a function, it will be called with the item object and expected to return an id
 * `displayProperty: String|Function` - the name of the property to be displayed for each item in the dataSource. If the displayProperty is a function, it will be called with the item object and expected to return the item display value.
 * `value: String|Number|Array` - a single value, or an array of values, if you want to have multiselect
 * `expanded` Boolean` - if you want to control the expanded prop (when this is true, the list is visible).
 * `defaultExpanded: Boolean` - defaults to false. Uncontrolled version of `expanded`.
 * `onChange(value)` - the onChange callback. Will be called with a value or an array of values.
 * `renderItem(props)` - a function that can be used to customize how an item is rendered. If you return a React Node, the node will be rendered. If instead you only modify the props passed into this fn and return undefined, those props will be reflected on the default renderItem implementation. You can also use `displayProperty: Function` to render something else for each item.
 * `renderTag(props)` - a function that can be used to customize how a selected item is rendered in the combo.
 * `tagClearTool` - specify false or null if you don't want to render a clear icon for selected items/tags.  
 * `gotoNextOnSelect` - defaults to true. If the combo is a `multiSelect` and this flag is true, when selecting an item, the current index is moved to the next item, so it can be easily selected by pressing the `Enter` key again.
 * `renderExpandTool: Function` - a function to render the expand tool. It receives props for the tool. If you only want to modify the props, you can do so and return undefined. Otherwise, you can return a custom expand tool.
 * `toggleSelection: Boolean` - defaults to true. When clicking an already selected item, it is deselected
 * `clearTextOnSelect: Boolean` - defaults to true. When you filter for an item, and then select one, the text is cleared.
 * `text: String` - the text to show in the filtering input. controlled version of `defaultText`
 * `defaultText: String`
 * `onTextChange: Function` - called when text is changed in the filtering input.


 ## Development

 ```sh
 $ git clone https://github.com/zippyui/react-combo.git
 $ npm i
 $ npm run dev
 ```

 Navigate to [http://localhost:9090/]

 ## License

 #### MIT
