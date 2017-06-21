import { injectReducer } from '../../redux/reducers'

const AboutPage = (store) => ({
  name: 'about',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const AboutPage = require('./AboutPage').default

      cb(null, AboutPage)
    }, 'AboutPage')
  }
})

export default AboutPage
