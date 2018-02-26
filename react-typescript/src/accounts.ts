import { AccountsClient } from '@accounts/client';
import { RestClient } from '@accounts/rest-client';

const accountsRest = new RestClient({
  apiHost: 'http://localhost:4000',
  rootPath: '/accounts',
});
const accounts = new AccountsClient({}, accountsRest);

export { accounts, accountsRest };
