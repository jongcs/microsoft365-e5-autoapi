import { AuthenticationProvider, AuthenticationProviderOptions } from "@microsoft/microsoft-graph-client";
import * as fs from 'fs';
import * as path from 'path';

class MyAuthenticationProvider implements AuthenticationProvider {
    private timestamp: number;
    private accessKey: string;
    private authenticationProviderOptions: {
        clientId: string,
        tenantId: string,
        secretKey: string,
        refreshKey: string
    };

    constructor(authenticationProviderOptions: {clientId: string, tenantId: string, secretKey: string, refreshKey: string}) {
        this.timestamp = 0;
        this.accessKey = "";
        this.authenticationProviderOptions = authenticationProviderOptions;
    }

    public async getAccessToken(): Promise<string> {
        console.log(Date.now() + " " + this.timestamp)
        if (Date.now() > this.timestamp) {
            let form = new URLSearchParams();
            form.append('grant_type', 'refresh_token');
            form.append('refresh_token', this.authenticationProviderOptions.refreshKey);
            form.append('client_id', this.authenticationProviderOptions.clientId);
            form.append('client_secret', this.authenticationProviderOptions.secretKey);
	    let response = await fetch(`https://login.microsoftonline.com/${this.authenticationProviderOptions.tenantId}/oauth2/v2.0/token`, {
                method: "POST",
                body: form,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
            let data = await response.json();
            let variables: {refresh_token: string, last_update: number} = {
                refresh_token: data.refresh_token ?? "",
                last_update: Date.now()
            };
            fs.writeFileSync(path.join(__dirname, 'tokens.json'), JSON.stringify(variables));
            this.accessKey = data.access_token;
            this.timestamp = Date.now() + (data.expires_in * 1000) - (5 * 60 * 1000);
            console.log("access key: " + data.access_token);
        }
        return Promise.resolve(this.accessKey);
    }
}

export default MyAuthenticationProvider;
