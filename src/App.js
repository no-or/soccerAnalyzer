import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import Button from "@paprika/button";
import GameModal from "./components/gameModal/gameModal";
import ResultTable from "./components/resultTable/resultTable";
const { ipcRenderer } = require("electron");

function App() {
  ipcRenderer.on("getAllGamesReply", (event, data) => {
    // console.log("getAllGamesReply:data: " + data);
    // data.forEach(d => {
    //   console.log(d);
    // });
    setGames(data);
  });

  ipcRenderer.on("getLeaguesReply", (event, data) => {
    setLeagues(data);
  });

  ipcRenderer.on("getLocationsReply", (event, data) => {
    setLocations(data);
  });

  ipcRenderer.on("getClubsReply", (event, data) => {
    setClubs(data);
  });

  const [games, setGames] = React.useState([]);
  const [leagues, setLeagues] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [clubs, setClubs] = React.useState([]);

  useEffect(() => {
    ipcRenderer.send("getAllGames");
    ipcRenderer.send("getLeagues");
    ipcRenderer.send("getLocations");
    ipcRenderer.send("getClubs");
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
      <GameModal games={games} isOpen={isOpen} handleClose={toggle} />
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
