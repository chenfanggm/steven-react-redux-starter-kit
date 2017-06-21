import ReactGA from 'react-ga'

ReactGA.initialize('UA-60711230-1')

export const reportPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}
