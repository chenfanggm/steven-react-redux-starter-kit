import { injectReducer } from '../../redux/reducers'

const AboutView = (store) => ({
  path: 'about',
  name: 'about',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const AboutView = require('./AboutView').default

      cb(null, AboutView)
    }, 'AboutView')
  }
})

export default AboutView
