import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import Button from "@paprika/button";
import GameModal from "./components/gameModal/gameModal";
import ResultTable from "./components/resultTable/resultTable";
const { ipcRenderer } = require("electron");

function App() {
  const [games, setGames] = React.useState([]);
  const [leagues, setLeagues] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [clubs, setClubs] = React.useState([]);
  const [referees, setReferees] = React.useState([]);

  useEffect(() => {
    ipcRenderer.on("getGamesReply", (event, data) => {
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
      console.log("ref reply ~~~~~~~~~~~~~~~~~~~");
      data.forEach(d => console.log(d));
      setReferees(data);
    });

    ipcRenderer.send("getGames");
    ipcRenderer.send("getLeagues");
    ipcRenderer.send("getClubLocations");
    ipcRenderer.send("getClubs");
    ipcRenderer.send("getReferees");
  }, []);

  const onDelete = id => {
    ipcRenderer.send("");
  };

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
      <GameModal
        games={games}
        leagues={leagues}
        clubs={clubs}
        locations={locations}
        referees={referees}
        isOpen={isOpen}
        handleClose={toggle}
      />
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
