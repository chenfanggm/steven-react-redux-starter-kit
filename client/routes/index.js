// We only need to import the modules necessary for initial render
import OneColumnLayout from '../layouts/OneColumnLayout'
import AuthRequiredWrapper from '../containers/AuthRequiredWrapper'
import AdminRequiredWrapper from '../containers/AdminRequiredWrapper'
import AboutView from './AboutView'
import PostListView from './PostListView'
import PostEditorView from './PostEditorView'
import PostView from './PostView'


export const createRoutes = (store) => ({
  path: '/',
  name: 'Home',
  component: OneColumnLayout,
  indexRoute: PostListView(store),
  childRoutes: [
    AboutView(store),
    {
      component: AuthRequiredWrapper,
      childRoutes: []
    },
    {
      component: AdminRequiredWrapper,
      childRoutes: [PostEditorView(store)]
    },
    // put it below other routes, due to it's root path /:postUrl
    PostView(store),
    // redirect unknown routes to home
    {
      path: '*',
      onEnter: (nextState, replace) => replace('/')
    }
  ]
})

export default createRoutes

