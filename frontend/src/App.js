// frontend/src/App.js
import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Volatility Estimators Dashboard</h1>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;