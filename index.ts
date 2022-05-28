import "isomorphic-fetch"; // or import the fetch polyfill you installed
import dotenv from "dotenv";
import * as path from 'path';
import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import * as tokens from "./tokens.json";
import MyAuthenticationProvider from "./auth";

dotenv.config({path: path.join(__dirname, '.env')});

let credentials = {
    clientId: process.env.CLIENT_ID,
    secretKey: process.env.CLIENT_SECRET,
    tenantId: process.env.TENANT_ID == "" ? "common" : process.env.TENANT_ID,
    refreshKey: process.env.REFRESH_TOKEN == "" ? tokens.refresh_token : process.env.REFRESH_TOKEN
}

let clientOptions: ClientOptions = {
    authProvider: new MyAuthenticationProvider(credentials)
};
const client = Client.initWithMiddleware(clientOptions);

const apiEndpoints = [
    "/me",
    "/me/drive/root",
    "/me/drive",
    "/users",
    "/me/messages",
    "/me/mailFolders/inbox/messageRules",
    "/me/drive/root/children",
    "/me/mailFolders",
    "/me/outlook/masterCategories"
];

const runApi = async (endpoint: string) => {
    return new Promise<void>(async (resolve) => {
        let response = await client.api(endpoint).get();
        console.log(response);
        resolve();
    })
}

// https://www.derpturkey.com/serial-promise-execution-with-javascript/
let chain = Promise.resolve();

try {
    for (let endpoint of apiEndpoints) {
        chain = chain.then(() => runApi(endpoint));
    }
    chain.then(() => console.log("complete"));
} catch (error) {
    throw error;
}
