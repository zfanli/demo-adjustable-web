import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AdjustableView from './views/AdjustableView';
import NotFound from './views/NotFound';
import './css/common.scss';

// This App component is for handle route of entire application.
const App: React.FC = () => {
  return (
    <Router>
      <Route path="/" exact component={AdjustableView} />
      <Route component={NotFound} />
    </Router>
  );
};

export default App;
