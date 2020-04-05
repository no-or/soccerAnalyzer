const { ipcMain } = require("electron");
const soccerStats = require("./soccer-stats-app.js");

console.log("front end comm loaded");

ipcMain.on("getAllGames", event => {
  // console.log(arg); // prints "ping"
  soccerStats
    .getAllGames()
    .then(res => {
      console.log(res);
      event.reply("getAllGamesReply", res.res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});
