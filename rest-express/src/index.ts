import * as express from 'express';
import * as session from 'express-session';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as Grant from 'grant-express';
import * as mongoose from 'mongoose';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { AccountsOauth } from '@accounts/oauth';
import accountsExpress from '@accounts/rest-express';
import MongoDBInterface from '@accounts/mongo';

console.log(accountsExpress);
mongoose.connect('mongodb://localhost:27017/js-accounts-rest-example-1');
const db = mongoose.connection;

const app = express();

app.use(morgan('tiny'), cors(), bodyParser.json());

app.use(session({ secret: 'very secret' }));

const grantConfig = {
  server: {
    protocol: 'http',
    host: 'localhost:3000',
    transport: 'session',
  },
  google: {
    key: '482121517992-db3abp8ol2k4ppe3kub8su2dp8qddsi4.apps.googleusercontent.com',
    secret: 'oGCIUVf4z8D4u8WR8ub8mXJX',
    state: 'xxs',
    access_type: 'offline',
    scope: ['profile', 'email'],
    callback: '/accounts/oauth/google/callback',
  },
};

app.use(new Grant(grantConfig));

const accountsServer = new AccountsServer(
  {
    db: new MongoDBInterface(db),
    tokenSecret: 'secret',
  },
  {
    password: new AccountsPassword(),
    oauth: new AccountsOauth({
      google: {
        authenticate: () => ({
          id: 'hello',
          email: 'davidyaha@gmail.com',
        }),
      },
    }),
  },
);
app.use(accountsExpress(accountsServer));

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
