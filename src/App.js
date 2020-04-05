import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import Button from "@paprika/button";
import GameModal from "./components/gameModal/gameModal";
import ResultTable from "./components/resultTable/resultTable";
const { ipcRenderer } = require("electron");

function App() {
  const [games, setGames] = React.useState([]);
  const [game, setGame] = React.useState(null);
  const [leagues, setLeagues] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [clubs, setClubs] = React.useState([]);
  const [referees, setReferees] = React.useState([]);

  useEffect(() => {
    ipcRenderer.on("getGamesReply", (event, data) => {
      console.log("getGamesReply: receieved updated games");
      console.log(data);
      setGames(data);
    });

    ipcRenderer.on("getLeaguesReply", (event, data) => {
      setLeagues(data);
    });

    ipcRenderer.on("getClubLocationsReply", (event, data) => {
      setLocations(data);
    });

    ipcRenderer.on("getClubsReply", (event, data) => {
      setClubs(data);
    });

    ipcRenderer.on("getRefereesReply", (event, data) => {
      setReferees(data);
    });

    ipcRenderer.on("insertGameReply", (event, data) => {
      setGame(null);
      ipcRenderer.send("getGames");
    });

    ipcRenderer.on("deleteGameReply", (event, data) => {
      // console.log("deleteGameReply: got delete game reply");
      ipcRenderer.send("getGames");
    });

    ipcRenderer.on("updateGameReply", (event, data) => {
      setGame(null);
      ipcRenderer.send("getGames");
    });

    ipcRenderer.send("getGames");
    ipcRenderer.send("getLeagues");
    ipcRenderer.send("getClubLocations");
    ipcRenderer.send("getClubs");
    ipcRenderer.send("getReferees");
  }, []);

  const openForInsert = () => {
    setGame(null);
    toggle();
  };
  const onDelete = id => {
    // console.log("deleting: " + id);
    ipcRenderer.send("deleteGame", id);
  };

  const onUpdate = id => {
    // console.log("deleting: " + id);
    console.log("games");
    games.forEach(g => console.log(g));
    let g = games.filter(m => m.id === id);
    setGame(g[0]);
    toggle();
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => {
    setIsOpen(state => !state);
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <h3>Insert, update and delete games:</h3>
      <div style={{ padding: "8px" }}>
        <span>Insert a New Game: </span>
        <Button onClick={() => openForInsert()}>Insert Game</Button>
      </div>
      <GameModal
        game={game}
        leagues={leagues}
        clubs={clubs}
        locations={locations}
        referees={referees}
        isOpen={isOpen}
        handleClose={toggle}
      />
      <ResultTable
        results={games}
        onUpdate={id => onUpdate(id)}
        onDelete={id => onDelete(id)}
      />
      {/* <ResultTable results={results} />
      <ResultTable results={results} /> */}
    </div>
  );
}

export default App;
