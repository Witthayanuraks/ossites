function StrictReturn(data = {}, requires = []) {
  const dataView = Object.keys(data).filter(a => requires.includes(a))
  const dataStructure = dataView.map((key) => ([key, data[key]]))
  return Object.fromEntries(dataStructure)
}
module.exports = StrictReturn