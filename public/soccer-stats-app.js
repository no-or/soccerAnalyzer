const mysql = require("mysql");
const ShortUniqueId = require("short-unique-id").default;
// const frontEndComm = require("./front-end-communication.js");

console.log("running soccer stats BE");
//Create connection
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1122334455",
  database: "db",
  port: 3308
});

connection.connect((err) => {

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
    connection.query('SELECT * FROM league', (error, result) => {
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

// Selection
const getClubs = req => {
  const promise = new Promise((resolve, reject) => {
    const select =
      "SELECT club1.name AS club, manager.name AS manager, leagueName as league, club1.country, club1.location ";
    const from = "FROM club1 natural join club2 join manager ";
    const orderBy = "ORDER BY league ASC, club ASC";

    let where = "WHERE club2.managerID = manager.managerID ";
    if (typeof req.leagueName === "string" && req.leagueName !== "All") {
      where = where + `AND leagueName = '${req.leagueName}' `;
    }
    if (typeof req.country === "string" && req.country !== "All") {
      where = where + `AND country = '${req.country}' `;
    }

    const query = select + from + where + orderBy;
    connection.query(query, (error, result) => {
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
    connection.query('SELECT DISTINCT location FROM club1', (error, result) => {
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

// Aggregation (also nested)
const getAvgGoalsPerPlayerPerClub = () => {
  const promise = new Promise((resolve, reject) => {
    const query =
      "SELECT clubName, AVG(goals) AS avgGoalsPerPlayer " +
      "FROM player " +
      "GROUP BY clubName ";

    connection.query(query, (error, result) => {
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

// Nested Aggregation
const getNumGamesPerClub = () => {
  const promise = new Promise((resolve, reject) => {
    const query =
      "SELECT club2.name, COUNT(gameID) AS gamesPlayed " +
      "FROM club2, game2 " +
      "WHERE c1Name = club2.name OR c2Name = club2.name " +
      "GROUP BY club2.name ";

    connection.query(query, (error, result) => {
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

// Division
const getClubsThatPlayedInAllLeagueLocations = () => {
  const promise = new Promise((resolve, reject) => {
    const division = "SELECT name " +
                     "FROM club1 c1 natural join club2 c2 " +
                     "WHERE NOT EXISTS " +
                     "(SELECT location " +
                     "FROM club1 natural join club2 " +
                     "WHERE leagueName = c2.leagueName AND location " +
                     "NOT IN " +
                     "(SELECT location " +
                     "FROM game1 natural join game2 " +
                     "WHERE c1Name = c2.name OR c2Name = c2.name))";

    connection.query(division, (error, result) => {
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

/* Player Functions */

// Projection
const getPlayers = req => {
  const promise = new Promise((resolve, reject) => {
    const { fields, clubName } = req;

    const from = "FROM player ";
    const where = `WHERE clubName = '${clubName}' `;
    const orderBy = "ORDER BY playerID ASC";

    let select = "SELECT ";
    for (let i = 0; i < fields.length; i++) {
      if (i !== fields.length - 1) {
        select = select + fields[i] + ", ";
      } else {
        select = select + fields[i] + " ";
      }
    }

    const query = select + from + where + orderBy;
    connection.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const players = result.map(res => {
          const { ...r } = res;
          const player = {
            id: r.playerID,
            ...r
          };
          delete player.playerID;
          if (player.hasOwnProperty("birthdate")) {
            player.birthdate = new Date(player.birthdate).toUTCString();
          }
          return player;
        });
        resolve(players);
      }
    });
  });
  return promise;
};

// Join
const getPlayerInjuries = () => {
  const promise = new Promise((resolve, reject) => {
    const query = 'SELECT name, type, duration AS durationDays, clubName, leagueName, dateAndTime AS injuryDate ' +
                  'FROM player natural join injury';

    connection.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const injuries = result.map(res => {
          const { ...r } = res;
          const injury = {
            id: ID.randomUUID(),
            ...r
          };
          injury.injuryDate = new Date(injury.injuryDate).toUTCString();
    
          return injury;
        });
        resolve(injuries);
      }
    });
  });
  return promise;
};

// Join
const getPlayerPenalties = () => {
  const promise = new Promise((resolve, reject) => {
    const query = 'SELECT player.name AS playerName, player.number, cardColor, minuteInGame, c1Name, c2Name, ' + 
                       'dateAndTime AS gameStartDate, leagueName, referee.name AS refereeName ' +
                  'FROM player natural join penalty natural join game2 join referee ' +
                  'WHERE penalty.refID = referee.refID';

    connection.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const penalties = result.map(res => {
          const { ...r } = res;
          const penalty = {
            id: ID.randomUUID(),
            ...r
          };
          penalty.gameStartDate = new Date(penalty.gameStartDate).toUTCString();
    
          return penalty;
        });
        resolve(penalties);
      }
    });
  });
  return promise;
};

// Join
const getGoalkeepers = () => {
  const promise = new Promise((resolve, reject) => {
    connection.query("SELECT * FROM player natural join goalkeeper", (error, result) => {
      if (error) {
        reject(error);
      } else {
        const goalkeepers = result.map(res => {
          const { name, ...r } = res;
          const gk = {
            id: r.playerID,
            name: name,
            ...r
          };
          delete gk.playerID;
          gk.birthdate = new Date(gk.birthdate).toUTCString();

          return gk;
        });
        resolve(goalkeepers);
      }
    });
  });
  return promise;
};

// Join
const getFieldPlayers = () => {
  const promise = new Promise((resolve, reject) => {
    connection.query("SELECT * FROM player natural join fieldPlayer", (error, result) => {
      if (error) {
        reject(error);
      } else {
        const fieldPlayers = result.map(res => {
          const { name, ...r } = res;
          const fp = {
            id: r.playerID,
            name: name,
            ...r
          };
          delete fp.playerID;
          fp.birthdate = new Date(fp.birthdate).toUTCString();

          return fp;
        });
        resolve(fieldPlayers);
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

    connection.query(query, (error, result) => {
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
    const {dateAndTime, c1Name, c2Name, location, c1Score, c2Score, leagueName, refID} = data;
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

    connection.query(game1Insert, (error, result) => {
      if (error) reject(error); 
    });

    connection.query(game2Insert, (error, result) => {
      if (error) reject(error); 
    });

    connection.query(officiatesInsert, (error, result) => {
      if (error) reject(error); 
    });
    resolve("Game inserted");
  });
  return promise;
};

// Update
const updateGame = data => {
  const promise = new Promise((resolve, reject) => {
    const {
      dateAndTime,
      c1Name,
      c2Name,
      location,
      c1Score,
      c2Score,
      leagueName,
      gameID
    } = data;

    // need to get old game2 because the old dateAndTime + c1Name + c2Name is the PK for game1
    const findGame2 = `SELECT * FROM game2 WHERE gameID = '${gameID}'`;
    connection.query(findGame2, (error, result) => {
      if (error) reject(error);

      const findResult = result.map(res => {
        const { dateAndTime, c1Name, c2Name, ...r } = res;
        const obj = {
          dateAndTime: dateAndTime,
          c1Name: c1Name,
          c2Name: c2Name,
          ...r
        };
        return obj;
      });

      // since javascript automatically converts dateTime objects I need to construct my own string
      const formattedDate = convertToMySqlFormat(new Date(findResult[0].dateAndTime));

      const game1Set =
        `SET dateAndTime = '${dateAndTime}', c1Name = '${c1Name}', c2Name = '${c2Name}', ` +
            `location = '${location}', c1Score = ${c1Score}, c2Score = ${c2Score} `;

      const game1Update = 
        "UPDATE game1 " + game1Set +
        `WHERE dateAndTime = '${formattedDate}' AND ` +
              `c1Name = '${findResult[0].c1Name}' AND ` +
              `c2Name = '${findResult[0].c2Name}'`;

      const game2Set = `SET dateAndTime = '${dateAndTime}', c1Name = '${c1Name}', c2Name = '${c2Name}', ` +
                           `leagueName = '${leagueName}' `;

      const game2Update = "UPDATE game2 " + game2Set + `WHERE gameID = '${gameID}'`;

      connection.query(game1Update, (error, result) => {
        if (error) reject(error);

        connection.query(game2Update, (error, result) => {
          if (error) reject(error);
          resolve("Game updated");
        });
      });
    });
  });
  return promise;
};

// Delete with cascade
const deleteGame = gameID => {
  const promise = new Promise((resolve, reject) => {
    const findGame2 = `SELECT * FROM game2 WHERE gameID = '${gameID}'`;
    const deleteGame2 = `DELETE FROM game2 WHERE gameID = '${gameID}'`;

    connection.query(findGame2, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const findResult = result.map(findResult => {
          const { dateAndTime, c1Name, c2Name, ...r } = findResult;
          const res = {
            dateAndTime: dateAndTime,
            c1Name: c1Name,
            c2Name: c2Name,
            ...r
          };
          return res;
        });

        // since javascript automatically converts dateTime objects I need to construct my own string
        const formattedDate = convertToMySqlFormat(new Date(findResult[0].dateAndTime));

        const deleteGame1 = `DELETE FROM game1 WHERE dateAndTime = '${formattedDate}' AND ` +
                                        `c1Name = '${findResult[0].c1Name}' AND ` +
                                        `c2Name = '${findResult[0].c2Name}'`;

        // cascades to remove corresponding tuple from 'officiates' table
        let promise1 = new Promise((resolve1, reject1) => {
          connection.query(deleteGame1, (error, result) => {
            if (error) return reject1(error);
            return resolve1("Game1 Deleted");
          });
        });

        let promise2 = new Promise((resolve2, reject2) => {
          connection.query(deleteGame2, (error, result) => {
            if (error) return reject2(error);
            return resolve2("Game2 Deleted");
          });
        });

        return Promise.all([promise1, promise2])
          .then(() => {
            resolve("Game deleted");
          })
          .catch(e => {
            reject(e);
          });
      }
    });
  });
  return promise;
};

/* Referee Functions */

const getReferees = () => {
  const promise = new Promise((resolve, reject) => {
    connection.query('SELECT * FROM referee', (error, result) => {

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

const convertToMySqlFormat = time => {
  const year = time.getFullYear();
  const month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
  const day = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
  const hour = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
  const minutes = time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
  const seconds = time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();

  return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
};

// league functions
module.exports.getLeagues = getLeagues;
// club functions
module.exports.getClubLocations = getClubLocations;
module.exports.getClubs = getClubs;
module.exports.getAvgGoalsPerPlayerPerClub = getAvgGoalsPerPlayerPerClub;
module.exports.getNumGamesPerClub = getNumGamesPerClub;
module.exports.getClubsThatPlayedInAllLeagueLocations = getClubsThatPlayedInAllLeagueLocations;
// player functions
module.exports.getPlayers = getPlayers;
module.exports.getPlayerInjuries = getPlayerInjuries;
module.exports.getPlayerPenalties = getPlayerPenalties;
module.exports.getGoalkeepers = getGoalkeepers;
module.exports.getFieldPlayers = getFieldPlayers;
// game functions
module.exports.getGames = getGames;
module.exports.insertGame = insertGame;
module.exports.updateGame = updateGame;
module.exports.deleteGame = deleteGame;
// referee functions
module.exports.getReferees = getReferees;
