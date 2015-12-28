export default (row, dir) => {
  const parentNode = row.parentNode

  const scrollTop = parentNode.scrollTop
  const parentHeight = parentNode.offsetHeight
  const scrollBottom = scrollTop + parentHeight
  const rowTop = row.offsetTop
  const rowBottom = rowTop + row.offsetHeight

  if (rowTop < scrollTop || rowBottom > scrollBottom){

    dir < 0?
      //going upwards
      parentNode.scrollTop = rowTop:

      //going downwards
      parentNode.scrollTop = rowBottom - parentHeight

    return true
  }

  return false
}
