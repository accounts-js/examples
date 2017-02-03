import express from 'express';
import bodyParser from 'body-parser';
import AccountsServer from '@accounts/server';
import accountsExpress from '@accounts/rest-express';
import RedisDBInterface from '@accounts/redis';

AccountsServer.config({
}, new RedisDBInterface());

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
