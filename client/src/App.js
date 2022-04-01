import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Admin from './pages/Admin';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/admin' element={<Admin/>}></Route>
    </Routes>
  );
};

export default App;