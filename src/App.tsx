import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './css/common.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Footer />
    </div>
  );
};

export default App;
