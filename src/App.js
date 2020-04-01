import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
const { ipcRenderer } = require('electron');

function callBackend() {
  let res = ipcRenderer.sendSync('synchronous-message', 'ping');
  console.log("here " + res );
}


function App() {
  useEffect(() => {
    console.log("helloweords");
    console.log("helloweords4");
    callBackend();
    console.log("helloweords2");
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
