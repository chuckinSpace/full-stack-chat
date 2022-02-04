# Coinsmart-challenge

Main features

NestJs - React/Typescript/Hooks - Cypress - Unit testing - e2e testing

## How to run

# Make sure you are able to run local mongodb instance or visit https://github.com/mongodb/homebrew-brew for instructions on how to install it.

# Run local mongodb instance in the background

```bash
# access app directory, (from root of the project)
cd app/
# run mongodb using local data folder
mongod --dbpath "./data"
```

# Run and Test the server "api-server"

```bash
# access api-server directory, (from root of the project)
cd app/api-server
# install dependencies
npm install
# run unit test for api-server
npm test
# run e2e test for api-server
npm run test:e2e
# run test coverage for api-server
npm run test:cov
# run the server, it will start on port 3500
npm start
```

# Run and Test the client "web-client"

## On a separate terminal, make sure api-server is running

```bash
# access web-client directory (from root of the project)
cd app/web-client
# install dependencies
npm install
# run the server, it will start on port 3000
npm start
# run cypress testing (from app/web-client) (both api-server and web-client should be running for cypress to work)
npx cypress open
```

// more time
Shared interfaces, enums between back and front
better ui and unit testing
separate database for e2e
better cypress code, using plugin and more reusable code
