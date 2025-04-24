// src/App.js
import React from 'react';
import Whiteboard from './Whiteboard'; // Import the new Whiteboard component
import './App.css';

function App() {
  return (
    // Main application container
    <div className="App">
      {/* Render the dedicated Whiteboard component */}
      <Whiteboard />
      {/* You could add other UI elements here later (toolbars, etc.) */}
    </div>
  );
}

export default App;