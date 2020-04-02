import React from "react";
import logo from "./logo.svg";
import SelectItem from "./components/selectItem/selectItem";
import Input from "@paprika/input";
import DateTimePicker from "react-datetime-picker";
import "./App.css";
import { useEffect, useState } from "react";
const { ipcRenderer } = require("electron");

function callBackend() {
  let res = ipcRenderer.sendSync("synchronous-message", "ping");
  console.log("here " + res);
}

function App() {
  useEffect(() => {
    console.log("helloweords");
    console.log("helloweords4");
    // callBackend();
    console.log("helloweords2");
  });

  const [league, setLeague] = useState("");
  let leagues = [
    "English Premier League",
    "Serie A",
    "La Liga",
    "Bundesliga",
    "Major League Soccer"
  ];

  const [club1, setClub1] = useState("");
  const [club2, setClub2] = useState("");
  const [location, setLocation] = useState("");
  const [club1Score, setClub1Score] = useState(null);
  const [club2Score, setClub2Score] = useState(null);
  const [date, setDate] = React.useState(null);
  let clubs = [
    "AFC Bournemouth",
    "Arsenal",
    "Aston Villa",
    "Brighton & Hove Albion",
    "Burnley",
    "Chelsea",
    "Crystal Palace",
    "Everton"
  ];
  let locations = ["Anfield", "Arsenal Stadium"];

  return (
    <div className="App">
      <div className="selection-container">
        <SelectItem
          category="League"
          items={leagues}
          selectedItem={league}
          onChange={selectedLeague => {
            setLeague(selectedLeague);
          }}
        />
        <SelectItem
          category="Club1"
          items={clubs}
          selectedItem={club1}
          onChange={selectedClub => {
            setClub1(selectedClub);
          }}
        />
        <SelectItem
          category="Club2"
          items={clubs}
          selectedItem={club2}
          onChange={selectedClub => {
            setClub2(selectedClub);
          }}
        />
        <SelectItem
          category="Location"
          items={locations}
          selectedItem={location}
          onChange={selectedLocation => {
            setLocation(selectedLocation);
          }}
        />
        <div className="input-container">
          <span className="input-label">Club1 Score:</span>
          <Input
            className="input-score"
            onChange={e => setClub1Score(e.target.value)}
            value={club1Score}
          />
        </div>
        <div className="input-container">
          <span className="input-label">Club2 Score:</span>
          <Input
            className="input-score"
            onChange={e => setClub2Score(e.target.value)}
            value={club2Score}
          />
        </div>
        <div className="input-container">
          <span className="input-label"> Game Time:</span>
          <DateTimePicker
            className="date-picker"
            clearIcon={null}
            calendarIcon={null}
            onChange={newDate => setDate(newDate)}
            value={date}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
