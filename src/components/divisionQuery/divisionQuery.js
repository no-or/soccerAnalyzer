import React from "react";
import ResultTable from "../resultTable/resultTable";
import Button from "@paprika/button";
import "./divisonQuery.css";

const { ipcRenderer } = require("electron");

export default function DivisonQuery() {
  const [clubs, setClubs] = React.useState([]);

  React.useEffect(() => {
    ipcRenderer.on("getClubsThatPlayedInAllLeagueLocationsReply", (event, data) => {
      setClubs(data);
    });
  }, [])

  const getClubsThatPlayedInAllLeagueLocations = () => {
    ipcRenderer.send("getClubsThatPlayedInAllLeagueLocations");
  }
  
  return (
    <div>
    <h3>Division to get clubs that played in all league locations:</h3>
    <div class="division-container">
    <span class="division-label">Get clubs that played in all league locations:</span>
    <Button onClick={() => getClubsThatPlayedInAllLeagueLocations()}>Get Clubs</Button>
    <ResultTable results={clubs}/>
    </div>
  </div>
  )
}