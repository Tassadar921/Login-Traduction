import { Client } from "edgedb";

module accountLoginRequest {
    export async function getPermissionByPasswordAndIdentifier(identifier : string, password : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User
                FILTER ( .email = "${identifier}" OR .username = "${identifier}") AND .password = "${password}"
            `));
        });
    }

    export async function getPermissionByTokenAndUsername(username : string, token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User {
                    username,
                }
                FILTER .token = "${token}" AND .username = "${username}"
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

    export async function getPermissionByUsername(username : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT Permission {
                    name
                }
                FILTER User.username = "${username}"
            `));
        });
    }

    export async function updateUserToken(username : string, token : string, client : Client) {
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