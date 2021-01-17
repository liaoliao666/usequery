// an simple endpoint for getting current list
let list = ['Item 1', 'Item 2', 'Item 3']

export default async ({ add, clear } = {}) => {
  if (add) {
    if (!list.includes(add)) {
      list.push(add)
    }
  } else if (clear) {
    list = []
  }

  await new Promise(r => setTimeout(r, 100))

  return JSON.parse(JSON.stringify(list))
}
