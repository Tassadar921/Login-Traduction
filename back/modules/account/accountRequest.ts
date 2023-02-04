import { Client } from "edgedb";

export module accountRequest {
    export async function checkUserByEmail(email : string, password : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User {
                    username,
                    email,
                }
                FILTER .email = ${email} AND .password = ${password}
            `);
            resolve(result);
        });
    }

    export async function checkUserByUsername(username : string, password : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User {
                    username,
                    email,
                }
                FILTER .username = ${username} AND .password = ${password}
            `);
            resolve(result);
        });
    }

    export async function checkUserByToken(username : string, token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User {
                    username,
                }
                FILTER .token = ${token} AND .username = ${username}
            `);
            resolve(result);
        });
    }

    export async function checkToken(token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User {
                    password,
                }
                FILTER .token = ${token}
            `);
            resolve(result);
        });
    }

    export async function updateUserToken(username : string, token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                UPDATE User
                FILTER .username = ${username}
                SET {
                    token := ${token},
                }
            `);
            resolve(result);
        });
    }

    export async function createUser(username : string, email : string, password : string, token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                insert User {
                    username := ${username};
                    email := ${email};
                    password := ${password};
                    token := ${token};
                }
            `);
            resolve(result);
        });
    
    }

    export async function checkUrlTokenByUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User_Creation {
                    username,
                    email,
                    password
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
                    username,
                    password
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