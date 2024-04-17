import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Swot from './components/Swot';
import CSF from './components/CSF'
import Docs from './components/Docs';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/learn-page" element={<Docs />} /> 
        <Route path="/strength-page" element={<Swot />} /> 
        <Route path="/csf-page" element={<CSF />} />
      </Routes>
    </Router>
  );
};

export default App;
