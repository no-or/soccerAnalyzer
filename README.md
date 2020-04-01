## To run

run:
yarn 

run:
yarn electron-dev


## Dependencies

node version 10.16.0
latest mysql docker image
yarn

### Backend code found in public/soccer-stats-app.js


## Trouble shooting

mysql is running on port 3308, you may need to change this back to the default 3306 in public/soccer-stats-app.js

https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server


## Available Scripts

To run dev mode:
### yarn electron-dev


To compile project for distribution:
### yarn electron-pack


## Learn More

Electron architecture:
https://www.electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes


Communication between front end and back end processes:
https://www.electronjs.org/docs/api/ipc-main
https://www.electronjs.org/docs/api/ipc-renderer


Electron with react:
https://www.codementor.io/@randyfindley/how-to-build-an-electron-app-using-create-react-app-and-electron-builder-ss1k0sfer

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).


To learn React, check out the [React documentation](https://reactjs.org/).

