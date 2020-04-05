import React from "react";
import SelectItem from "../selectItem/selectItem";
import Input from "@paprika/input";
import DateTimePicker from "react-datetime-picker";
import Modal from "@paprika/modal";
import Button from "@paprika/button";
import "./gameModal.css";
const { ipcRenderer } = require("electron");

function twoDigits(d) {
  if (0 <= d && d < 10) return "0" + d.toString();
  if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
  return d.toString();
}
Date.prototype.toMysqlFormat = function() {
  return (
    this.getUTCFullYear() +
    "-" +
    twoDigits(1 + this.getUTCMonth()) +
    "-" +
    twoDigits(this.getUTCDate()) +
    " " +
    twoDigits(this.getUTCHours()) +
    ":" +
    twoDigits(this.getUTCMinutes()) +
    ":" +
    twoDigits(this.getUTCSeconds())
  );
};

export default function GameModal({
  isOpen,
  handleClose,
  games,
  leagues,
  clubs,
  referees,
  locations
}) {
  const [leagueNames, setLeagueNames] = React.useState([]);
  const [clubNames, setClubNames] = React.useState([]);
  const [locationNames, setLocationNames] = React.useState([]);
  const [refereeNames, setRefereeNames] = React.useState([]);

  const [league, setLeague] = React.useState("");
  const [club1, setClub1] = React.useState("");
  const [club2, setClub2] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [referee, setReferee] = React.useState(null);
  const [club1Score, setClub1Score] = React.useState(null);
  const [club2Score, setClub2Score] = React.useState(null);
  const [date, setDate] = React.useState(null);

  React.useEffect(() => {
    setLeagueNames(leagues.map(league => league.name));
    setClubNames(clubs.map(club => club.club));
    setLocationNames(clubs.map(location => location.location));
    setRefereeNames(referees.map(ref => ref.name));
  }, [leagues, clubs, locations, referees]);

  React.useEffect(() => {
    if (league !== "") {
      let filteredClubs = clubs.filter(club => club.league === league);
      setClubNames(filteredClubs.map(club => club.club));
    }
  }, [league]);

  React.useEffect(() => {
    let filteredLocations = [];
    let cs = [];
    clubs.forEach(club => {
      if (club.club == club1 || club.club == club2) {
        cs.push(club);
      }
    });

    cs.forEach(c => {
      let { location } = c;
      filteredLocations.push(location);
    });

    if (filteredLocations.length > 0) {
      setLocationNames(filteredLocations);
    }
  }, [club1, club2]);

  const insertGame = () => {
    let ref = referees.filter(ref => ref.name === referee);
    let mysqlDate = new Date(date).toMysqlFormat();
    ipcRenderer.send("insertGame", {
      dateAndTime: mysqlDate,
      c1Name: club1,
      c2Name: club2,
      location,
      c1Score: club1Score,
      c2Score: club2Score,
      leagueName: league,
      refID: ref[0].id
    });
    ipcRenderer.send("getGames");
    handleClose();
  };

  //todo make modal controlled by external button

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Header hasCloseButton={true}>Insert Game</Modal.Header>
      <Modal.Content>
        <div className="App">
          <div className="selection-container">
            <SelectItem
              category="League"
              items={leagueNames}
              selectedItem={league}
              onChange={selectedLeague => {
                setLeague(selectedLeague);
              }}
            />
            <SelectItem
              category="Club 1"
              items={clubNames}
              selectedItem={club1}
              onChange={selectedClub => {
                setClub1(selectedClub);
              }}
            />
            <SelectItem
              category="Club 2"
              items={clubNames}
              selectedItem={club2}
              onChange={selectedClub => {
                setClub2(selectedClub);
              }}
            />
            <SelectItem
              category="Location"
              items={locationNames}
              selectedItem={location}
              onChange={selectedLocation => {
                setLocation(selectedLocation);
              }}
            />
            <SelectItem
              category="Referee"
              items={refereeNames}
              selectedItem={referee}
              onChange={selectedReferee => {
                setReferee(selectedReferee);
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
        <Button kind="primary" onClick={() => insertGame()}>
          Insert
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
