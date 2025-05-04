import React, { useEffect } from 'react';
import Whiteboard from './Whiteboard';
import './App.css';
import './ThemeToggle.css';
import ThemeToggle from './ThemeToggle';

function App() {
  useEffect(() => {
    ThemeToggle.init();
  }, []);

  return (
    <div className="App">
      <Whiteboard />
    </div>
  );
}

export default App;