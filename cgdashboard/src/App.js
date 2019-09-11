import React from 'react';
import './App.css';
import HomePage from './HomePage'

function App() {
  return (
    <div className="App">
      <div className="list-books-title">
        <h1 className="header-text">Dashboard</h1>
      </div>
      <HomePage />
    </div>
  );
}

export default App;
