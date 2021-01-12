if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/v-use-query.production.min.js')
} else {
  module.exports = require('./dist/v-use-query.development.js')
}
