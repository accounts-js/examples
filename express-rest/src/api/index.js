import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import AccountsServer from '@accounts/server';
import accountsExpress from '@accounts/rest-express';
import MongoDBInterface from '@accounts/mongo';

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/js-accounts-express-rest');
const db = mongoose.connection;

AccountsServer.config({
  title: 'express-rest',
  tokenSecret: 'terrible secret',
  passwordSignupFields: 'USERNAME_AND_EMAIL',
  tokenConfigs: {
    accessToken: {
      expiresIn: '1d',
    },
    refreshToken: {
      expiresIn: '14d',
    },
  },
}, new MongoDBInterface(db));

let PORT = 3010;
if (process.env.PORT) {
  PORT = parseInt(process.env.PORT, 10) + 100;
}

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(accountsExpress(AccountsServer, {}));

app.listen(PORT, () => console.log( // eslint-disable-line no-console
  `API Server is now running on http://localhost:${PORT}`,
));
