const { ipcMain } = require("electron");
const soccerStats = require("./soccer-stats-app.js");

console.log("front end comm loaded");

ipcMain.on("getLeagues", event => {
  soccerStats
    .getLeagues()
    .then(res => {
      console.log(res);
      event.reply("getLeaguesReply", res.res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

ipcMain.on("getAllGames", event => {
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
