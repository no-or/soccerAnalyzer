import React from "react";
import SelectItem from "../selectItem/selectItem";
import Checkbox from "@paprika/checkbox";
import Button from "@paprika/button";
import ResultTable from "../resultTable/resultTable";

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
      <h3>Project player fields:</h3>
      <SelectItem
        category="Club"
        items={clubNames}
        selectedItem={club}
        onChange={selectedClub => {
          setClub(selectedClub);
        }}
      />
      <h4>Choose projection fields:</h4>
      <PlayerFieldCheckboxs
        fields={fields}
        checkboxState={checkboxState}
        checkboxStateString={checkboxStateString}
        handleChange={handleChange}
      />
      <span style={{ paddingLeft: "8px" }}> Projection on player:</span>
      <Button onClick={() => projectPlayers()}>Project</Button>
      <ResultTable results={players} />
    </div>
  );
}
