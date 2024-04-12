import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Strength from './components/Strength';
import OppandThreat from './components/OppandThreat';
import CSF from './components/CSF';
import Result from './components/Result';
import Docs from './components/Docs';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/learn-page" element={<Docs />} /> 
        <Route path="/strength-page" element={<Strength />} /> 
        <Route path="/other-page" element={<OppandThreat />} />
        <Route path="/csf-page" element={<CSF />} />
      </Routes>
    </Router>
  );
};

export default App;
