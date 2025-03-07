import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/test')  // Replace with your actual API path
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => setError(error.message));
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>Proxy Test:</p>
        {data ? <p>Success: {JSON.stringify(data)}</p> : <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
      </header>
    </div>
  );
}

export default App;
