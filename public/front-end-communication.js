const { ipcMain } = require("electron");
const soccerStats = require("./soccer-stats-app.js");

console.log("front end comm loaded");

ipcMain.on("getGames", event => {
  soccerStats
    .getGames()
    .then(res => {
      event.reply("getGamesReply", res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

ipcMain.on("getLeagues", event => {
  soccerStats
    .getLeagues()
    .then(res => {
      event.reply("getLeaguesReply", res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

ipcMain.on("getClubLocations", event => {
  soccerStats
    .getClubLocations()
    .then(res => {
      event.reply("getClubLocationsReply", res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

ipcMain.on("getClubs", event => {
  soccerStats
    .getClubs({})
    .then(res => {
      event.reply("getClubsReply", res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

ipcMain.on("getReferees", event => {
  soccerStats
    .getReferees()
    .then(res => {
      console.log("getRefereesReply~~~~~~~~~~~~");
      event.reply("getRefereesReply", res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

ipcMain.on("insertGame", (event, args) => {
  // console.log("insert game");
  // console.log(args);
  soccerStats
    .insertGame(args)
    .then(res => {
      event.reply("insertGameReply", res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

ipcMain.on("deleteGame", (event, args) => {
  console.log("delete game");
  console.log(args);
  soccerStats
    .deleteGame(args)
    .then(res => {
      event.reply("deleteGameReply", res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

ipcMain.on("updateGame", (event, args) => {
  console.log("update game");
  console.log(args);
  soccerStats
    .updateGame(args)
    .then(res => {
      event.reply("updateGameReply", res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

// selection
ipcMain.on("getSelectClubs", (event, args) => {
  console.log("get selcet: " + args);
  soccerStats
    .getClubs(args)
    .then(res => {
      event.reply("getSelectClubsReply", res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});

// projection
ipcMain.on("getProjectPlayers", (event, args) => {
  console.log("get project: " + args);
  soccerStats
    .getPlayers(args)
    .then(res => {
      console.log("ress: " + res);
      event.reply("getProjectPlayersReply", res);
    })
    .catch(e => {
      console.log("Error: " + e);
    });
});
