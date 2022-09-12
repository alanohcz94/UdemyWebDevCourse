import React, {Fragment} from 'react';
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import './App.css';

function App() {
  return (
    <Router>
      <Fragment>
          <Navbar />
          <section className="container">
          <Routes>
            <Route path='/' element={<Landing/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
          </Routes> 
          </section>  
      </Fragment>
    </Router>
  );
}

export default App;
