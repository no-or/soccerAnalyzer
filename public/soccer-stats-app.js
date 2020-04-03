const mysql = require("mysql");

console.log("running soccer stats BE");
//Create connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3308,
  password: "1122334455",
  database: "db"
});

connection.connect(err => {
  if (err) {
    throw err;
  }
  console.log("MySql connected . . .");
});

// createDB();

// ipcMain.on("anyname", (event, arg) => {
//   console.log(arg); // prints "ping"
//   creatDB();
//   event.returnValue = "pong";
// });

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

//Create Table TEST
function creatTable() {
  let sql =
    "CREATE TABLE test(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))";
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    return "Table created . . . .";
  });
}
