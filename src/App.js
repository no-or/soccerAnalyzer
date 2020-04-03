import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import GameModal from "./components/gameModal/gameModal";
const { ipcRenderer } = require("electron");

function callBackend() {
  let res = ipcRenderer.sendSync("anyname", "ping");
  console.log("here " + res);
}

function App() {
  useEffect(() => {
    callBackend();
  });

  return (
    <div>
      <h3>Insert New Game</h3>
      <GameModal />
    </div>
  );
}

export default App;
