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

    export async function checkUrlTokenByUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User_Creation {
                    username,
                }
                FILTER .urlToken = ${urlToken}
            `);
            resolve(result);
        });
    }

    export async function checkUrlTokenByEmail(email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User_Creation {
                    urlToken,
                }
                FILTER .email = ${email}
            `);
            resolve(result);
        });
    }

    export async function createUrlToken(urlToken : string, username : string, email : string, password : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                insert User_Creation {
                    urlToken := ${urlToken};
                    username := ${username};
                    email := ${email};
                    password := ${password};
                }
            `);
            resolve(result);
        });
    }

    export async function deleteUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                delete User_Creation
                    filter .urlToken = ${urlToken};
                insert User_Creation {
                    urlToken := ${urlToken};
                }
            `);
            resolve(result);
        });
    }
}