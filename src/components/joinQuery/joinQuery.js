import React from "react";
import ResultTable from "../resultTable/resultTable";
import Button from "@paprika/button";
import "./joinQuery.css";

const { ipcRenderer } = require("electron");
// import "./selectionQuery.css";

export default function JoinQuery() {

  const [injuries, setInjuries] = React.useState([]);
  const [penalties, setPenalties] = React.useState([]);
  const [goalKeepers, setGoalKeepers] = React.useState([]);
  const [fieldPlayers, setFieldPlayers] = React.useState([]);

  const getPlayerInjuries = ()=>{
    ipcRenderer.send("getPlayerInjuries");
  }
  const getPlayerPenalties = ()=>{
    ipcRenderer.send("getPlayerPenalties");
  }
  const getGoalkeepers = ()=>{
    ipcRenderer.send("getGoalkeepers");
  }
  const getFieldPlayers = ()=>{
    ipcRenderer.send("getFieldPlayers");
  }

  React.useEffect(() => {
    ipcRenderer.on("getPlayerInjuriesReply", (event, data) => {
      console.log(data);
      setInjuries(data);
    });
    ipcRenderer.on("getPlayerPenaltiesReply", (event, data) => {
      setPenalties(data);
    });
    ipcRenderer.on("getGoalkeepersReply", (event, data) => {
      setGoalKeepers(data);
    });
    ipcRenderer.on("getFieldPlayersReply", (event, data) => {
      setFieldPlayers(data);
    });
  }, [])

  return <div>
  <h3>Join player related tables:</h3>
  <div class="join-container">
  <span class="join-label">Join players and injuries:</span>
  <Button onClick={() => getPlayerInjuries()}>Get Injuries</Button>
  <ResultTable results={injuries}/>
  </div>

  <div class="join-container">
  <span class="join-label">Join players and penalties:</span>
  <Button onClick={() => getPlayerPenalties()}>Get penalties</Button>
  <ResultTable results={penalties}/>
  </div>

  <div class="join-container">
  <span class="join-label">Join players and goal keepers:</span>
  <Button onClick={() => getGoalkeepers()}>Get goal keepers</Button>
  <ResultTable results={goalKeepers}/>
  </div>

  <div class="join-container">
  <span class="join-label">Join players and fieldPlayers:</span>
  <Button onClick={() => getFieldPlayers()}>Get fieldPlayers</Button>
  <ResultTable results={fieldPlayers}/>
  </div>
  </div>
}