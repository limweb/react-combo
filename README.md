react-combo
===========

React Combo

## Properties

 * constrainTo - When the combo list is opened, it will use this property in order to know the area to which it should be constrained.
    If this prop is **true** (which is the default), the list will be constrained to the document element.
    If you specify **constrainTo** to be a string selector, it will be used to query the DOM for a parent node of the combo that matches the given selector, and the list will be constrained to that element.
    If you specify a function, that function will be called and is expected to return a DOM node to which to constrain the combo list.

 * idProperty
 * displayProperty
 * clearTool
 * onSelect
 * onChange
 * readOnly
 * style
 * listStyle
 * onFilter
 * stateful
 * hiddenName
 * value
 * displayValue