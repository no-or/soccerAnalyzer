const { ipcMain } = require("electron");
const soccerStats = require("./soccer-stats-app.js");

console.log("front end comm loaded");

ipcMain.on("getGames", event => {
  soccerStats
    .getGames()
    .then(res => {
      console.log(res);
      event.reply("getAllGamesReply", res.res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

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

ipcMain.on("getClubLocations", event => {
  soccerStats
    .getClubLocations()
    .then(res => {
      console.log(res);
      event.reply("getClubLocationsReply", res.res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

ipcMain.on("getClubs", event => {
  soccerStats
    .getClubs()
    .then(res => {
      console.log(res);
      event.reply("getClubsReply", res.res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});
