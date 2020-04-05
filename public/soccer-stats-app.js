const mysql = require("mysql");
const ShortUniqueId = require("short-unique-id").default;
// const frontEndComm = require("./front-end-communication.js");

console.log("running soccer stats BE");
//Create connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1122334455",
  database: "db",
  port: 3308
});

con.connect(err => {
  if (err) {
    throw err;
  }
  console.log("MySql connected . . .");
});

// Instantiate id generator
const ID = new ShortUniqueId();

/* League Functions */

const getLeagues = () => {
  const promise = new Promise((resolve, reject) => {
    con.query("SELECT * FROM league", (error, result) => {
      if (error) {
        reject(error);
      } else {
        const res = result.map(r => {
          return { id: ID.randomUUID(), ...r };
        });
        resolve(res);
      }
    });
  });
  return promise;
};

/* Club Functions */

const getClubs = () => {
  const promise = new Promise((resolve, reject) => {
    const query =
      "SELECT club1.name AS club, manager.name AS manager, leagueName as league, club1.country, club1.location " +
      "FROM club1 natural join club2 join manager " +
      "WHERE club2.managerID = manager.managerID " +
      "ORDER BY league ASC, club ASC";

    con.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const res = result.map(r => {
          return { id: ID.randomUUID(), ...r };
        });
        resolve(res);
      }
    });
  });
  return promise;
};

const getClubLocations = () => {
  const promise = new Promise((resolve, reject) => {
    con.query("SELECT DISTINCT location FROM club1", (error, result) => {
      if (error) {
        reject(error);
      } else {
        const res = result.map(r => {
          return { id: ID.randomUUID(), ...r };
        });
        resolve(res);
      }
    });
  });
  return promise;
};

/* Game Functions */

const getGames = () => {
  let promise = new Promise((resolve, reject) => {
    const query =
      "SELECT gameID, dateAndTime, c1Name AS club1, c2Name AS club2, c1Score AS club1Score, " +
      "c2Score AS club2Score, leagueName AS league, location, referee.name AS refereeName " +
      "FROM game1 natural join game2 natural join officiates natural join referee";

    con.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const res = result.map(res => {
          const { dateAndTime, ...r } = res;
          const game = {
            id: r.gameID,
            dateAndTime: new Date(dateAndTime).toUTCString(),
            ...r
          };
          delete game.gameID;
          return game;
        });
        resolve(res);
      }
    });
  });
  return promise;
};

// Insert
const insertGame = data => {
  const promise = new Promise((resolve, reject) => {
    const {
      dateAndTime,
      c1Name,
      c2Name,
      location,
      c1Score,
      c2Score,
      leagueName,
      refID
    } = data;
    const gameID = ID.randomUUID();

    const game1Insert =
      `INSERT INTO game1 (dateAndTime, c1Name, c2Name, location, c1Score, c2Score) ` +
      `VALUES ('${dateAndTime}', '${c1Name}', '${c2Name}', '${location}', '${c1Score}', '${c2Score}')`;

    const game2Insert =
      `INSERT INTO game2 (gameID, dateAndTime, c1Name, c2Name, leagueName) ` +
      `VALUES ('${gameID}', '${dateAndTime}', '${c1Name}', '${c2Name}', '${leagueName}')`;

    const officiatesInsert =
      `INSERT INTO officiates (refID, gameID) ` +
      `VALUES ('${refID}', '${gameID}')`;

    con.query(game1Insert, (error, result) => {
      if (error) reject(error);
    });

    con.query(game2Insert, (error, result) => {
      if (error) reject(error);
    });

    con.query(officiatesInsert, (error, result) => {
      if (error) reject(error);
    });
    resolve("Game inserted");
  });
  return promise;
};

/* Referee Functions */

const getReferees = () => {
  const promise = new Promise((resolve, reject) => {
    con.query("SELECT * FROM referee", (error, result) => {
      if (error) {
        reject(error);
      } else {
        const res = result.map(res => {
          const { birthdate, ...r } = res;
          const ref = {
            id: r.refID,
            birthdate: new Date(birthdate).toUTCString(),
            ...r
          };
          delete ref.refID;
          return ref;
        });
        resolve(res);
      }
    });
  });
  return promise;
};

// Del game by PK
const delGame = gameID => {
  if (!gameID) return { status: 400, res: "gameID is required" };

  let sql1 = `SELECT * FROM GAME2 WHERE gameID = '${gameID}'`;
  let sql2 = `DELETE FROM GAME2 WHERE gameID = '${gameID}'`;

  con.query(sql1, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }

    let { date, c1Name, c2Name } = result[0];
    date = formatDate(date);

    con.query(sql2, (err, result) => {
      if (err) {
        return { status: 500, res: err };
      }

      let sql3 = `DELETE FROM GAME1 WHERE date = '${date}' and c1Name = '${c1Name}' and c2Name = '${c2Name}'`;
      con.query(sql3, (err, result) => {
        if (err) {
          return { status: 500, res: err };
        }

        return { status: 200, res: "Game removed successfully . . . ." };
      });
    });
  });
};

// Send in all the attributes of both of the game tables no matter  if they are changing or not
const updateGame = data => {
  if (!data.gameID) return { status: 400, res: "gameID is required" };
  const {
    gameID,
    date,
    c1Name,
    c2Name,
    leagueName,
    location,
    c1Score,
    c2Score
  } = data;

  let sql1 = `SELECT * FROM GAME2 WHERE gameID = '${gameID}'`;
  let sql2 =
    `UPDATE GAME2 SET date = '${date}', leagueName= '${leagueName}',` +
    `c1Name = '${c1Name}', c2Name = '${c2Name}' WHERE gameID = '${gameID}'`;

  con.query(sql1, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }

    let old = result[0];
    old.date = formatDate(old.date);

    con.query(sql2, (err, result) => {
      if (err) {
        return { status: 500, res: err };
      }

      let sql3 =
        `UPDATE GAME1 SET date = '${date}', c1Name = '${c1Name}', c2Name = '${c2Name}', location = '${location}',` +
        `c1Score = '${c1Score}', c2Score = '${c2Score}'  WHERE date = '${old.date}' and c1Name = '${old.c1Name}' and c2Name = '${old.c2Name}'`;

      con.query(sql3, (err, result) => {
        if (err) {
          return { status: 500, res: err };
        }

        return { status: 200, res: "Game Updated successfully . . . ." };
      });
    });
  });
};

module.exports.getGames = getGames;
module.exports.getLeagues = getLeagues;
module.exports.getClubLocations = getClubLocations;
module.exports.getClubs = getClubs;
module.exports.getReferees = getReferees;
module.exports.insertGame = insertGame;
