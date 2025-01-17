import React from "react";
import SelectItem from "../selectItem/selectItem";
import ResultTable from "../resultTable/resultTable";
import Button from "@paprika/button";
import "./selectionQuery.css";

const { ipcRenderer } = require("electron");

export default function SelectionQuery({ leagues }) {
  React.useEffect(() => {
    ipcRenderer.on("getSelectClubsReply", (event, data) => {
      setClubs(data);
    });
  }, []);
  let countries = [
    "All",
    "England",
    "France",
    "Spain",
    "Italy",
    "Germany"
  ];
  const [leagueNames, setLeagueNames] = React.useState([""]);
  const [clubs, setClubs] = React.useState([]);
  const [league, setLeague] = React.useState("");
  const [country, setCountry] = React.useState("");

  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    if (country === "" || league === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [country, league])

  const selectClubs = () => {
    console.log("selecting clubs");
    ipcRenderer.send("getSelectClubs", { leagueName: league, country });
  };

  React.useEffect(() => {
    let LN = leagues.map(league => league.name);
    LN.push("All");
    setLeagueNames(LN);
  }, [leagues]);

  return (
    <div>
      <h3>Select clubs by country and league:</h3>
      <h4>Choose filter conditions:</h4>
      <div class="selection-button">
      <SelectItem
        category="Country"
        items={countries}
        selectedItem={country}
        onChange={selectedCountry => {
          setCountry(selectedCountry);
        }}
      />
      </div>
      <div class="selection-button">
      <SelectItem
        category="League"
        items={leagueNames}
        selectedItem={league}
        onChange={selectedLeague => {
          setLeague(selectedLeague);
        }}
      />
      </div>
      <span class="selection-label">Select clubs:</span>
      <Button onClick={() => selectClubs()} isDisabled={disabled}>Select</Button>
      <ResultTable results={clubs} />
    </div>
  );
}
