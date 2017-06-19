// only need to import the modules necessary for initial render
import OneColumnLayout from '../containers/OneColumnLayout'
import AboutView from './AboutView'

const createRoutes = (store) => ({
  path: '/',
  name: 'Home',
  component: OneColumnLayout,
  indexRoute: AboutView(store),
  childRoutes: [
    // redirect unknown routes to home
    {
      path: '*',
      onEnter: (nextState, replace) => replace('/')
    }
  ]
})

export default createRoutes

