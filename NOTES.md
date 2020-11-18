# Notes about the project

## Local settings used in development:

### Starting both frontend and backend in one script

See https://stackoverflow.com/questions/51126472/how-to-organise-file-structure-of-backend-and-frontend-in-mern

- start both frontend and backend with NPM package concurrently. Frontend local port is setup in frontend/package.json under "scripts: {start}". 

- Then backend/package.json has a  script named nodemon" that starts nodemon. The root level package.json has a script named "start-all" that can launch both scripts in frontend and backend.

- both front and back ends can thus be launched by running npm run start-all in the root level


### Local URLs

- in **frontend** see *URL* variable in *api/api-calls.js*
- in **backend** see *.env* with the environment variables

### CORS
- The CORS options that allows API calls from the frontend are inside the **backend** folder: *startup/routes.js*. 
- Local value is the *LOCAL_FRONTEND_URL* environment variable

### Database indexing
- Disabling autoindex in mongoose connect options might enhance performance, setting is in the **backend** folder: *startup/connect-db.js*


## Backend summary

### Dedicated folders for dev / prod environments
- These folders are in the **backend**: *startup/dev.js* and *startup/prod.js*
  
#### *startup/dev.js*
- Uses **morgan** module for logging purposes

#### *startup/prod.js*
- Uses **helmet** module for web security and **compression** to compress requests

## Frontend summary


