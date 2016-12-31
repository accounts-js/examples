import express from 'express';
import bodyParser from 'body-parser';
import { AccountsServer } from '@accounts/accounts';
import { accountsExpress } from '@accounts/rest-api';

AccountsServer.config({
}, {
  findUserByEmail: () => Promise.resolve(true),
  findUserByUsername: () => Promise.resolve(true),
  createUser: () => Promise.resolve(true),
});

let PORT = 3010;
if (process.env.PORT) {
  PORT = parseInt(process.env.PORT, 10) + 100;
}

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(accountsExpress(AccountsServer));

app.listen(PORT, () => console.log( // eslint-disable-line no-console
  `API Server is now running on http://localhost:${PORT}`,
));
