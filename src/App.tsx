import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AdjustableView from './views/AdjustableView';
import './css/common.scss';

// This App component is for handle route of entire application.
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={AdjustableView} />
      </div>
    </Router>
  );
};

export default App;
