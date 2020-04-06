import React from "react";
import SelectItem from "../selectItem/selectItem";
import Checkbox from "@paprika/checkbox";
import Button from "@paprika/button";
import ResultTable from "../resultTable/resultTable";
import './projectionQuery.css'

const { ipcRenderer } = require("electron");

function PlayerFieldCheckboxs({
  fields,
  checkboxState,
  handleChange,
  checkboxStateString
}) {
  // console.log(checkboxStateString);
  return fields.map((field, index) => {
    return (
      <Checkbox
        onChange={() => handleChange(index)}
        checkedState={checkboxState[index] ? "checked" : "unchecked"}
      >
        {field}
      </Checkbox>
    );
  });
}

export default function ProjectionQuery({ clubs }) {
  const [clubNames, setClubNames] = React.useState([]);
  const [club, setClub] = React.useState("");
  const [checkboxState, setCheckboxState] = React.useState([]);
  const [checkboxStateString, setCheckboxStateString] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() =>{
  let ts = checkboxState.filter((state) => state);
  if (ts.length === 0 || club === "") {
    setDisabled(true);
  } else {
    setDisabled(false);
  }
  }, [checkboxStateString])

  const [players, setPlayers] = React.useState([]);
  React.useEffect(() => {
    ipcRenderer.on("getProjectPlayersReply", (event, data) => {
      console.log("recevied data" + data);
      data.forEach(d => {
        console.log(d);
      });
      setPlayers(data);
    });
  }, []);

  const fields = [
    `playerID`,
    `clubName`,
    `leagueName`,
    `number`,
    `name`,
    `birthdate`,
    `heightCM`,
    `weightKG`,
    `goals`,
    `assists`,
    `numRedCards`,
    `numYellowCards`
  ];

  React.useEffect(() => {
    let state = [];
    fields.forEach((field, index) => {
      state[index] = false;
    });
    setCheckboxState(state);
    setCheckboxStateString(state.toString());
  }, []);

  const handleChange = index => {
    let state = checkboxState;
    state[index] = !state[index];
    console.log("checkbox state: " + state);
    setCheckboxState(state);
    setCheckboxStateString(state.toString());
  };

  const projectPlayers = () => {
    let fs = fields.filter((f, index) => checkboxState[index]);
    console.log("feilds: " + fs);
    ipcRenderer.send("getProjectPlayers", { clubName: club, fields: fs });
  };

  React.useEffect(() => {
    let CN = clubs.map(club => club.club);
    setClubNames(CN);
  }, [clubs]);

  return (
    <div> 
      <h3>Projection on player fields:</h3>
      <h4>Choose projection fields:</h4>
      <PlayerFieldCheckboxs
        fields={fields}
        checkboxState={checkboxState}
        checkboxStateString={checkboxStateString}
        handleChange={handleChange}
      />
      <div class="projection-button">
      <SelectItem
        category="Club"
        items={clubNames}
        selectedItem={club}
        onChange={selectedClub => {
          setClub(selectedClub);
        }}
      />
      </div>
      <div class="projection-button">
      <span class="projection-label"> Projection on player:</span>
      <Button onClick={() => projectPlayers()}  isDisabled={disabled}>Project</Button>
      </div>
      <ResultTable results={players} />
    </div>
  );
}
