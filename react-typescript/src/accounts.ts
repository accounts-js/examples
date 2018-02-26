import { AccountsClient } from '@accounts/client';
import { RestClient } from '@accounts/rest-client';

const accountsRest = new RestClient({});
const accounts = new AccountsClient({}, accountsRest);

// accounts.loginWithService('oauth', { provider: 'google' }).then(user => console.log(user));

export { accounts, accountsRest };
