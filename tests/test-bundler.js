// ---------------------------------------
// Test Environment Setup
// ---------------------------------------
import 'normalize'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import chaiEnzyme from 'chai-enzyme'

// ------------------------------------
// Mocha / Chai
// ------------------------------------
mocha.setup({ ui: 'bdd' })
global.should = chai.should()
global.chai = chai
global.sinon = sinon
global.expect = chai.expect

// ------------------------------------
// Chai Plugins
// ------------------------------------
chai.use(chaiEnzyme())
chai.use(chaiAsPromised)
chai.use(sinonChai)

// ---------------------------------------
// Require Tests
// ---------------------------------------
// require all `tests/**/*.spec.*`
const testsContext = require.context('./', true, /\.(spec)\.(js|ts|tsx)$/)

// only run tests that have changed after the first pass.
// for use with karma-webpack-with-fast-source-maps
const __karmaWebpackManifest__ = []
const allTests = testsContext.keys()
const changedTests =  allTests.filter(path => {
  return __karmaWebpackManifest__.indexOf(path) !== -1
})

;(changedTests.length ? changedTests : allTests).forEach(testsContext)

// require all `src/**/*.js` except for `main.js` (for isparta coverage reporting)
// if (__COVERAGE__) {
//   const componentsContext = require.context('../src/', true, /^((?!main|reducers).)*\.js$/)
//   componentsContext.keys().forEach(componentsContext)
// }
