const mysql = require("mysql");
const ShortUniqueId = require("short-unique-id").default;

console.log("running soccer stats BE");
<<<<<<< HEAD
=======

>>>>>>> 9ecd9c2d14d4a7e2070d1b3817cb20ac7ab6ce75
//Create connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1122334455",
  database: "db",
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql connected . . .");
});

<<<<<<< HEAD
// createDB();

// ipcMain.on("anyname", (event, arg) => {
//   console.log(arg); // prints "ping"
//   creatDB();
//   event.returnValue = "pong";
// });
=======
//Instantiate id generator
const ID = new ShortUniqueId();
>>>>>>> 9ecd9c2d14d4a7e2070d1b3817cb20ac7ab6ce75

//Create DB
function creatDB() {
  let sql = "CREATE DATABASE db";
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    return "Database created . . . .";
  });
}

// initialize the DB
creatDB();

//Insert data into a Game table - inserts both in GAME1 AND GAME2
//data is an object with all the required attributes
const insertGame = (data) => {
  if (!data.location) throw new Error("location can not be null");

  const { leagueName, c1Name, date, c2Name, location, c1Score, c2Score } = data;

  const gameID = ID.randomUUID(4);

  let sql1 = `INSERT INTO GAME1 (date, c1Name, c2Name, location, c1Score, c2Score) VALUES ('${date}', '${c1Name}', '${c2Name}', '${location}', '${c1Score}', '${c2Score}')`;

  let sql2 = `INSERT INTO GAME2 (gameID, date, c1Name, c2Name, leagueName) VALUES ('${gameID}', '${date}', '${c1Name}', '${c2Name}', '${leagueName}')`;

  connection.query(sql1, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }
    connection.query(sql2, (err, result) => {
      if (err) {
        return { status: 500, res: err };
      }

      return { status: 200, res: "Game inserted successfully . . . ." };
    });
  });
};

// Get leagues
const getLeagues = () => {
  let sql = "SELECT * from LEAGUE";

  connection.query(sql, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }

    return { status: 200, res: result };
  });
};

// Get Club By LeagueName
const getClubByLeagueName = (leagueName) => {
  let sql = `SELECT * FROM CLUB2 WHERE leagueName = '${leagueName}' `;

  connection.query(sql, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }

    return { status: 200, res: result };
  });
<<<<<<< HEAD
}
=======
};

// Get Location By ClubName
const getLocByClubName = (clubName) => {
  let sql = `SELECT location FROM CLUB1 WHERE name = '${clubName}' `;

  connection.query(sql, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }

    return { status: 200, res: result };
  });
};

// Get All Games
const getAllGames = () => {
  let sql = `SELECT * FROM GAME2`;

  connection.query(sql, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }

    return { status: 200, res: result };
  });
};

// Get games by leagueName
const getGamesByLeague = (leagueName) => {
  let sql = `SELECT * FROM GAME2 WHERE leagueName = '${leagueName}' `;

  connection.query(sql, (err, result) => {
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

  connection.query(sql1, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }

    let { date, c1Name, c2Name } = result[0];
    date = formatDate(date);

    connection.query(sql2, (err, result) => {
      if (err) {
        return { status: 500, res: err };
      }

      let sql3 = `DELETE FROM GAME1 WHERE date = '${date}' and c1Name = '${c1Name}' and c2Name = '${c2Name}'`;
      connection.query(sql3, (err, result) => {
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

  connection.query(sql1, (err, result) => {
    if (err) {
      return { status: 500, res: err };
    }

    let old = result[0];
    old.date = formatDate(old.date);

    connection.query(sql2, (err, result) => {
      if (err) {
        return { status: 500, res: err };
      }

      let sql3 =
        `UPDATE GAME1 SET date = '${date}', c1Name = '${c1Name}', c2Name = '${c2Name}', location = '${location}',` +
        `c1Score = '${c1Score}', c2Score = '${c2Score}'  WHERE date = '${old.date}' and c1Name = '${old.c1Name}' and c2Name = '${old.c2Name}'`;

      connection.query(sql3, (err, result) => {
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
>>>>>>> 9ecd9c2d14d4a7e2070d1b3817cb20ac7ab6ce75
