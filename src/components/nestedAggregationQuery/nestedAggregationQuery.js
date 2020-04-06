import React from "react";
import ResultTable from "../resultTable/resultTable";
import Button from "@paprika/button";
import "./nestedAggregationQuery.css";

const { ipcRenderer } = require("electron");

export default function NestedAggregationQuery() {

  const [numGames, setNumGames] = React.useState([]);

  React.useEffect(() => {
    ipcRenderer.on("getNumGamesPerClubReply", (event, data) => {
      setNumGames(data);
    });
  }, [])

  const getNumGamesPerClub = () => {
    ipcRenderer.send("getNumGamesPerClub");
  }

  return (
  <div>
    <h3>Nested Aggregate to get number of games per club:</h3>
    <div class="nest-aggr-container">
    <span class="nest-aggr-label">Aggregate number of game per club:</span>
    <Button onClick={() => getNumGamesPerClub()}>Get Aggregate</Button>
    <ResultTable results={numGames}/>
    </div>
  </div>
  );
}