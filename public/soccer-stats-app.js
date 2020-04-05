const mysql = require("mysql");
const ShortUniqueId = require("short-unique-id").default;
// const frontEndComm = require("./front-end-communication.js");

console.log("running soccer stats BE");
//Create connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1122334455",
  database: "db"
  // port: 3308
});

con.connect((err) => {
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
    con.query('SELECT * FROM league', (error, result) => {
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
    const query = 'SELECT club1.name AS club, manager.name AS manager, leagueName as league, club1.country, club1.location ' +
                  'FROM club1 natural join club2 join manager ' +
                  'WHERE club2.managerID = manager.managerID ' +
                  'ORDER BY league ASC, club ASC';

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
    con.query('SELECT DISTINCT location FROM club1', (error, result) => {
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
    const query = 'SELECT gameID, dateAndTime, c1Name AS club1, c2Name AS club2, c1Score AS club1Score, ' + 
                         'c2Score AS club2Score, leagueName AS league, location, referee.name AS refereeName ' +
                  'FROM game1 natural join game2 natural join officiates natural join referee';

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
const insertGame = (data) => {
  const promise = new Promise((resolve, reject) => {
    const { dateAndTime, c1Name, c2Name, location, c1Score, c2Score, leagueName, refID } = data;
    const gameID = ID.randomUUID();

    const game1Insert = `INSERT INTO game1 (dateAndTime, c1Name, c2Name, location, c1Score, c2Score) ` +
                        `VALUES ('${dateAndTime}', '${c1Name}', '${c2Name}', '${location}', '${c1Score}', '${c2Score}')`;

    const game2Insert = `INSERT INTO game2 (gameID, dateAndTime, c1Name, c2Name, leagueName) ` +
                        `VALUES ('${gameID}', '${dateAndTime}', '${c1Name}', '${c2Name}', '${leagueName}')`;

    const officiatesInsert = `INSERT INTO officiates (refID, gameID) ` +
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
    resolve('Game inserted');
  });
  return promise;
};

// Update
const updateGame = (data) => {
  const promise = new Promise((resolve, reject) => {
    const { dateAndTime, c1Name, c2Name, location, c1Score, c2Score, leagueName } = data;

    // need to get old game2 because the old dateAndTime + c1Name + c2Name is the PK for game1
    const findGame2 = `SELECT * FROM game2 WHERE gameID = '${req.params.gameID}'`;
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

      const time = new Date(findResult[0].dateAndTime);
      const year = time.getFullYear();
      const month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1);
      const day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate();
      const hour = time.getHours() > 9 ? time.getHours() : '0' + time.getHours();
      const minutes = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes();
      const seconds = time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds();
      // since javascript automatically converts dateTime objects I need to construct my own string
      const formattedDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;

      const game1Set = `SET dateAndTime = '${dateAndTime}', c1Name = '${c1Name}', c2Name = '${c2Name}', ` + `
                            location = '${location}', c1Score = ${c1Score}, c2Score = ${c2Score} `;

      const game1Update = 'UPDATE game1 ' + game1Set + `WHERE dateAndTime = '${formattedDate}' AND ` + 
                                                             `c1Name = '${findResult[0].c1Name}' AND ` + 
                                                             `c2Name = '${findResult[0].c2Name}'`;

      const game2Set = `SET dateAndTime = '${dateAndTime}', c1Name = '${c1Name}', c2Name = '${c2Name}', ` + 
                           `leagueName = '${leagueName}' `;

      const game2Update = 'UPDATE game2 ' + game2Set + `WHERE gameID = '${req.params.gameID}'`;

      connection.query(game1Update, (error, result) => {
        if (error) reject(error); 

        connection.query(game2Update, (error, result) => {
          if (error) reject(error); 
        });
      });
    });
    resolve('Game updated');
  });
  return promise;
};

// Delete with cascade
const deleteGame = (gameID) => {
  const promise = new Promise((resolve, reject) => {
    const findGame2 = `SELECT * FROM game2 WHERE gameID = '${req.params.gameID}'`;
    const deleteGame2 = `DELETE FROM game2 WHERE gameID = '${req.params.gameID}'`;

    con.query(findGame2, (error, result) => {
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

        const time = new Date(findResult[0].dateAndTime);
        const year = time.getFullYear();
        const month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1);
        const day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate();
        const hour = time.getHours() > 9 ? time.getHours() : '0' + time.getHours();
        const minutes = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes();
        const seconds = time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds();
        // since javascript automatically converts dateTime objects to some other format I need to construct my own string
        const formattedDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;

        const deleteGame1 = `DELETE FROM game1 WHERE dateAndTime = '${formattedDate}' AND ` + 
                                                    `c1Name = '${findResult[0].c1Name}' AND ` + 
                                                    `c2Name = '${findResult[0].c2Name}'`;
      
        // cascades to remove corresponding tuple from 'officiates' table
        connection.query(deleteGame1, (error, result) => {
          if (error) throw error;
        });

        connection.query(deleteGame2, (error, result) => {
          if (error) throw error;
        });
      }
    });
    resolve('Game deleted');
  });
  return promise;
};

/* Referee Functions */

const getReferees = () => {
  const promise = new Promise((resolve, reject) => {
    con.query('SELECT * FROM referee', (error, result) => {
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

module.exports.getLeagues = getLeagues;

module.exports.getClubs = getClubs;
module.exports.getClubLocations = getClubLocations;

module.exports.getGames = getGames;
module.exports.insertGame = insertGame;
module.exports.updateGame = updateGame;
module.exports.deleteGame = deleteGame;

module.exports.getReferees = getReferees;
