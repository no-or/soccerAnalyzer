import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import Button from "@paprika/button";
import GameModal from "./components/gameModal/gameModal";
import ResultTable from "./components/resultTable/resultTable";
const { ipcRenderer } = require("electron");

function App() {
  ipcRenderer.on("getAllGamesReply", (event, data) => {
    console.log("getAllGamesReply:data: " + data);
    data.forEach(d => {
      console.log(d);
    });
    setGames(data);
  });

  const [games, setGames] = React.useState([]);
  useEffect(() => {
    ipcRenderer.send("getAllGames");
  }, []);

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
        results={games}
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
