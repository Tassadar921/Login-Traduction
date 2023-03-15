//----------------------------------------Notification----------------------------------------
//Version 1.0.0 
//This module manage the request to the database for accountResetPassword.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------------

import { Client } from "edgedb";

module accountResetPasswordRequest {
    export async function getUsernameByEmail(email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User {
                    username,
                }
                FILTER .email = "${email}"
            `));
        });
    }

    export async function getUrlTokenByEmail(email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT Reset_Password {
                    urlToken
                }
                FILTER .email = "${email}"
            `));
        });
    }

    export async function getEmailByUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT Reset_Password {
                    email
                }
                FILTER .urlToken = "${urlToken}"
            `));
        });
    }

    export async function deleteResetPasswordByUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                delete Reset_Password
                    filter .urlToken = "${urlToken}";
            `));
        });
    }

    export async function createResetPassword(urlToken : string, email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                insert Reset_Password {
                    urlToken := "${urlToken}",
                    email := "${email}"
                }
            `));
        });
    }

    export async function resetPassword(email : string, password : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                UPDATE User
                FILTER .email = "${email}"
                SET {
                    password := "${password}",
                }
            `));
        });
    }
}

export default accountResetPasswordRequest;