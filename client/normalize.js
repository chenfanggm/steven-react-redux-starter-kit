// 1) Object.assign
Object.assign = require('object-assign')

// 2) Promise
// ------------------------------------
if (typeof Promise === 'undefined') {
  require('promise/lib/rejection-tracking').enable()
  window.Promise = require('promise/lib/es6-extensions.js')
}

// 3) Fetch
// ------------------------------------
if (typeof window.fetch === 'undefined') {
  require('whatwg-fetch')
}
