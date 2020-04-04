import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import Button from "@paprika/button";
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

  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => {
    setIsOpen(state => !state);
  };

  return (
    <div>
      <h3>Insert, update and delete games:</h3>
      <div style={{ padding: "8px" }}>
        <span>Insert a New Game: </span>
        <Button onClick={toggle}>Insert Game</Button>
      </div>
      <GameModal isOpen={isOpen} handleClose={toggle} />
      <ResultTable
        results={results}
        onUpdate={id => {
          toggle();
          console.log("table button: " + id);
        }}
        onDelete={id => console.log("table button: " + id)}
      />
      {/* <ResultTable results={results} />
      <ResultTable results={results} /> */}
    </div>
  );
}

export default App;
