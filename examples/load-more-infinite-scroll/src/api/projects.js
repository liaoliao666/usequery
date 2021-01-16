// an endpoint for getting projects data
export default cursor => {
  cursor = parseInt(cursor) || 0
  const pageSize = 5

  const data = Array(pageSize)
    .fill(0)
    .map((_, i) => {
      return {
        name: 'Project ' + (i + cursor) + ` (server time: ${Date.now()})`,
        id: i + cursor,
      }
    })

  const nextId = cursor < 10 ? data[data.length - 1].id + 1 : null
  const previousId = cursor > -10 ? data[0].id - pageSize : null

  return new Promise(resolve => {
    setTimeout(() => resolve({ data, nextId, previousId }), 1000)
  })
}
