import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import accountsExpress from '@accounts/rest-express';
import MongoDBInterface from '@accounts/mongo';

mongoose.connect('mongodb://localhost:27017/js-accounts-rest-example-1');
const db = mongoose.connection;

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accountsServer = new AccountsServer({
  db: new MongoDBInterface(db),
  tokenSecret: 'secret',
} as any, {
  password: new AccountsPassword()
});
app.use(accountsExpress(accountsServer));

app.listen(3000);
