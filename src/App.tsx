import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AdjustableView from './views/AdjustableView'
import NotFound from './views/NotFound'
import './css/common.scss'

// This App component is for handle route of entire application.
const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={AdjustableView} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default App
