import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import GameModal from "./components/gameModal/gameModal";
import ResultTable from "./components/resultTable/resultTable";
const { ipcRenderer } = require("electron");

function callBackend() {
  let res = ipcRenderer.sendSync("anyname", "ping");
  console.log("here " + res);
}

let results = [
  { id: 1, name: "Wasif", age: 21, email: "wasif@email.com" },
  { id: 2, name: "Ali", age: 19, email: "ali@email.com" },
  { id: 3, name: "Saad", age: 16, email: "saad@email.com" },
  { id: 4, name: "Asad", age: 25, email: "asad@email.com" }
];

function App() {
  useEffect(() => {
    // callBackend();
  });

  return (
    <div>
      <h3>Insert New Game</h3>
      <GameModal />
      <ResultTable results={results} />
    </div>
  );
}

export default App;
