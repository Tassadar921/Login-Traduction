//----------------------------------------SignUp----------------------------------------
//Version 1.0.0 
//This module manage the request to the database for accountNotification.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import { Client } from "edgedb";

module accountBasicRequest {
    export async function getUsernameAndEmailByUsernameAndEmail(username : string, email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User {
                    username,
                    email,
                }
                FILTER .email = "${email}" OR .username = "${username}"
            `));
        });
    }

    export async function getUsernameBySessionToken(token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User {
                    username,
                }
                FILTER .token = "${token}"
            `));
        });
    }

    export async function createUser(username : string, email : string, password : string, token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                insert User {
                    username := "${username}",
                    email := "${email}",
                    password := "${password}",
                    token := "${token}"
                }
            `));
        });
    }

    export async function getUsernameAndEmailAndPasswordByUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User_Creation {
                    username,
                    email,
                    password,
                }
                FILTER .urlToken = "${urlToken}"
            `));
        });
    }

    export async function getUrlTokenByEmail(email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User_Creation {
                    urlToken,
                }
                FILTER .email = "${email}"
            `));
        });
    }

    export async function createUserCreation(urlToken : string, username : string, email : string, password : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                insert User_Creation {
                    urlToken := "${urlToken}",
                    username := "${username}",
                    email := "${email}",
                    password := "${password}"
                }
            `));
        });
    }

    export async function deleteUserCreationByUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                delete User_Creation
                    filter .urlToken = "${urlToken}";
            `));
        });
    }
}

export default accountBasicRequest;