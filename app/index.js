import polyfill from './polyfill'
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router'
import { createHashHistory } from 'history'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'

import App from './containers/App'
import Gaps from './containers/Gaps'
import AboutPage from './containers/AboutPage'
import configure from './store'

const store = configure()
const history = syncHistoryWithStore(useRouterHistory(createHashHistory)({ queryKey: false }), store)

var routes = (
  <Route>
    <Route name='landing page' path='/about' component={AboutPage}/>
    <Route path='/'>
      <IndexRoute name='default view' view='default' component={App}/>
      <Route name='country view' path='show/:region(/:filters(/:overlay(/:embed(/:theme))))' view='country' component={App}/>
      <Route name='compare view' path='compare/:region(/:times(/:filters(/:embed(/:theme))))' view='compare' component={App}/>
    </Route>
    <Route path='/gaps'>
      <IndexRoute name='gap detection map' view='gaps' component={Gaps}/>
      <Route name='gap detection region' path='/gaps/:region/:filters(/:embed(/:theme))' view='gaps-region' component={Gaps}/>
    </Route>
  </Route>
)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
)
