import React from 'react';
import PersonalCabinet from './PersonalCabinet';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="app-nav">
        <button 
          className='personal'
        >
          🧑‍💼 Личный кабинет
        </button>
      </nav>
      
      <PersonalCabinet />
    </div>
  );
}

export default App;