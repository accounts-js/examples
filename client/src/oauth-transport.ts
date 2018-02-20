import { RestClient } from '@accounts/rest-client';

export class OauthTransport extends RestClient {
  // tslint:disable-next-line:no-any
  async loginWithService(provider: string, data: any, customHeaders?: object): Promise<any> {
    await this.openOauthPopup('google');
  }

  openOauthPopup(providerName: string) {
    return new Promise(resolve => {
      const oauthUrl = `http://localhost:3000/connect/${providerName}`;
      const windowName = `login-with-${providerName}`; // should not include space for IE
      const windowOptions = 'location=0,status=0,width=800,height=600';
      const oauthWindow = window.open(oauthUrl, windowName, windowOptions);
      const oauthInterval = window.setInterval(() => {
        if (oauthWindow && oauthWindow.closed) {
          window.clearInterval(oauthInterval);
          resolve();
        }
        // tslint:disable-next-line:align
      }, 1000);
    });
  }
}
