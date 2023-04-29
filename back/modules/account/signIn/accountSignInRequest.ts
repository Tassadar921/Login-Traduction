//----------------------------------------SignIn----------------------------------------
//Version 1.0.0 
//This module manage the request to the database for accountSignIn.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import { Client } from "edgedb";

module accountLoginRequest {
    export async function getUsernameByPasswordAndIdentifier(identifier : string, password : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User {
                    username,
                }
                FILTER ( .email = "${identifier}" OR .username = "${identifier}") AND .password = "${password}"
            `));
        });
    }

    export async function getUserByTokenAndUsername(username : string, token : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User
                FILTER .token = "${token}" AND .username = "${username}"
            `));
        });
    }

    export async function getUsernameBySessionToken(token : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User {
                    username,
                }
                FILTER .token = "${token}"
            `));
        });
    }

    export async function getPermissionByUsername(username : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT Permission {
                    name
                }
                FILTER User.username = "${username}"
            `));
        });
    }

    export async function updateUserToken(username : string, token : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                UPDATE User
                FILTER .username = "${username}"
                SET {
                    token := "${token}",
                }
            `));
        });
    }
}

export default accountLoginRequest;