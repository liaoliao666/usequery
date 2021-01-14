if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vu-query.production.min.js')
} else {
  module.exports = require('./dist/vu-query.development.js')
}
