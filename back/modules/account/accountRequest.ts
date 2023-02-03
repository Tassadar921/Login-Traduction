import { Client } from "edgedb";

export module accountRequest {
    export async function checkUser(username : string, email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User {
                    username,
                    email,
                }
                FILTER .username = ${username} OR .email = ${email}
            `);
            resolve(result);
        });
    }

    export async function checkToken(token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User {
                    username,
                }
                FILTER .token = ${token}
            `);
            resolve(result);
        });
    }
}