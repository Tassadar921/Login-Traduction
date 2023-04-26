//----------------------------------------SignUp----------------------------------------
//Version 1.0.0 
//This module manage the request to the database for resetTablesRequest.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import { Client } from "edgedb";

module resetTablesRequest {
    export async function getUrlTokenFromResetPassword(client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT Reset_Password {
                    urlToken
                };
            `));
        });
    }
    export async function getUrlTokenFromUserCreation(client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User_Creation {
                    urlToken
                };
            `));
        });
    }
}

export default resetTablesRequest;