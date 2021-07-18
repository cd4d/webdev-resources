# Links bookmarker

## Full-stack MERN application:

This application allowing links to be saved in a remote database with optional email-based registration. Guest users data is saved in local storage. 

Links previews and images are displayed if available with OpenGraph. 

Links are saved under topics which can have sub topics, hence the data structure is similar to a tree with 2 levels.

The backend performs the tree structure operations such as (optionally) preserving children topics if a parent topic is deleted, moving a child topic to another parent topic etc.

The frontend dynamically generates sidebar navigation from the topics in the database.

### Backend:
- [NodeJS](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [MongooseJS](https://mongoosejs.com/)
- [ExpressJS](https://expressjs.com/)
- [PassportJS](https://www.passportjs.org/) authentication sessions
- [Nodemailer](https://nodemailer.com/) for password reset
- [Helmet](https://helmetjs.github.io/)
- [Validator.js](https://www.npmjs.com/package/validator)
- [Jest](https://jestjs.io/)

### Frontend:

- [ReactJS](https://reactjs.org/)
- [React-router](https://www.npmjs.com/package/react-router)
- [Axios](https://axios-http.com/)
- [Uuid](https://www.npmjs.com/package/uuid)
- [Bootstrap](https://getbootstrap.com/)