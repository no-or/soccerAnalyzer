const mysql = require("mysql");
const ShortUniqueId = require("short-unique-id").default;

console.log("running soccer stats BE");

//Create connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1122334455",
  database: "db",
});

con.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql connected . . .");
});

//Instantiate id generator
const ID = new ShortUniqueId();

/* League Functions */

// Selection
const getLeagues = () => {
  let promise = new Promise((resolve, reject) => {
    con.query('SELECT * FROM league', (error, result) => {
      if (error) {
        reject(error);
      } else {
        let res = result.map(r => {
          return { id: ID.randomUUID(), ...r };
        });
        resolve(res);
      }
    });
  });
  return promise;
};

/* Club Functions */

// Selection + Projection + Join
const getClubs = () => {
  let promise = new Promise((resolve, reject) => {
    const query = 'SELECT club1.name AS club, manager.name AS manager, leagueName as league, club1.country, club1.location ' +
                  'FROM club1 natural join club2 join manager ' +
                  'WHERE club2.managerID = manager.managerID ' +
                  'ORDER BY league ASC, club ASC';

    con.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        let res = result.map(r => {
          return { id: ID.randomUUID(), ...r };
        });
        resolve(res);
      }
    });
  });
  return promise;
};

// Selection + Projection
const getClubLocations = () => {
  let promise = new Promise((resolve, reject) => {
    con.query('SELECT DISTINCT location FROM club1', (error, result) => {
      if (error) {
        reject(error);
      } else {
        let res = result.map(r => {
          return { id: ID.randomUUID(), ...r };
        });
        resolve(res);
      }
    });
  });
  return promise;
};







//Insert data into a Game table - inserts both in GAME1 AND GAME2
//data is an object with all the required attributes
const insertGame = (data) => {
  if (!data.location) throw new Error("location can not be null");

  const { leagueName, c1Name, date, c2Name, location, c1Score, c2Score } = data;

  const gameID = ID.randomUUID(4);

  let sql1 = `INSERT INTO GAME1 (date, c1Name, c2Name, location, c1Score, c2Score) VALUES ('${date}', '${c1Name}', '${c2Name}', '${location}', '${c1Score}', '${c2Score}')`;

  let sql2 = `INSERT INTO GAME2 (gameID, date, c1Name, c2Name, leagueName) VALUES ('${gameID}', '${date}', '${c1Name}', '${c2Name}', '${leagueName}')`;

  con.query(sql1, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }
    con.query(sql2, (err, result) => {
      if (err) {
        return { status: 500, res: err };
      }

      return { status: 200, res: "Game inserted successfully . . . ." };
    });
  });
};

// Get All Games
const getAllGames = () => {
  let sql = `SELECT * FROM GAME2`;

  con.query(sql, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }

    return { status: 200, res: result };
  });
};

// Get games by leagueName
const getGamesByLeague = (leagueName) => {
  let sql = `SELECT * FROM GAME2 WHERE leagueName = '${leagueName}' `;

  con.query(sql, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }

    return { status: 200, res: result };
  });
};

// Del game by PK
const delGame = (gameID) => {
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
const updateGame = (data) => {
  if (!data.gameID) return { status: 400, res: "gameID is required" };
  const {
    gameID,
    date,
    c1Name,
    c2Name,
    leagueName,
    location,
    c1Score,
    c2Score,
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

// util func to format date
const formatDate = (currentDate) => {
  if (!Date.prototype.toISODate) {
    // eslint-disable-next-line no-extend-native
    Date.prototype.toISODate = function () {
      return (
        this.getFullYear() +
        "-" +
        ("0" + (this.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + this.getDate()).slice(-2)
      );
    };
  }

  return currentDate.toISODate();
};
