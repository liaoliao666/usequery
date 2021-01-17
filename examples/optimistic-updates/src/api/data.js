const items = []

export default async text => {
  await new Promise(r => setTimeout(r, 1000))

  if (text) {
    // sometimes it will fail, this will cause a regression on the UI

    if (Math.random() > 0.7) {
      return Promise.reject({ message: 'Could not add item!' })
    }

    items.push(text.toUpperCase())
    return Promise.resolve(text.toUpperCase())
  }

  return Promise.resolve(
    JSON.parse(
      JSON.stringify({
        ts: Date.now(),
        items,
      })
    )
  )
}
