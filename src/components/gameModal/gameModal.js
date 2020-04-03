import React from "react";
import SelectItem from "../selectItem/selectItem";
import Input from "@paprika/input";
import DateTimePicker from "react-datetime-picker";
import Modal from "@paprika/modal";
import Button from "@paprika/button";
import "./gameModal.css";

export default function GameModal() {
  const [isOpen, setIsOpen] = React.useState(true);
  const toggle = () => {
    setIsOpen(state => !state);
  };

  const [league, setLeague] = React.useState("");
  let leagues = [
    "English Premier League",
    "Serie A",
    "La Liga",
    "Bundesliga",
    "Major League Soccer"
  ];

  const [club1, setClub1] = React.useState("");
  const [club2, setClub2] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [club1Score, setClub1Score] = React.useState(null);
  const [club2Score, setClub2Score] = React.useState(null);
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
    <div>
      <Button onClick={toggle}>Insert Game</Button>
      <Modal isOpen={isOpen} onClose={toggle}>
        <Modal.Header hasCloseButton={true}>Insert Game</Modal.Header>
        <Modal.Content>
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
                category="Club 1"
                items={clubs}
                selectedItem={club1}
                onChange={selectedClub => {
                  setClub1(selectedClub);
                }}
              />
              <SelectItem
                category="Club 2"
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
                <span className="input-label">Club 1 Score:</span>
                <Input
                  className="input-score"
                  onChange={e => setClub1Score(e.target.value)}
                  value={club1Score}
                />
              </div>
              <div className="input-container">
                <span className="input-label">Club 2 Score:</span>
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
        </Modal.Content>
        <Modal.Footer>
          <Button kind="primary">Insert</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
