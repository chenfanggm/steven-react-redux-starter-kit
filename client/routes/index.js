import OneColumnLayout from '../containers/OneColumnLayout'
import AboutPage from './AboutPage'

const createRoutes = (store) => ({
  path: '/',
  name: 'Home',
  component: OneColumnLayout,
  indexRoute: AboutPage(store),
  childRoutes: [
    // redirect unknown routes to home
    { path: '*', onEnter: (nextState, replace) => replace('/') }
  ]
})

export default createRoutes

