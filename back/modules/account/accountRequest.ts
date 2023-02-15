import { Client } from "edgedb";

export module accountRequest {
    export async function checkUser(username : string, email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User {
                    username,
                    email,
                }
                FILTER .email = "${email}" OR .username = "${username}"
            `);
            resolve(result);
        });
    }

    export async function checkUserAndPassword(identifier : string, password : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User {
                    username,
                    email,
                }
                FILTER ( .email = "${identifier}" OR .username = "${identifier}") AND .password = "${password}"
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
                FILTER .token = "${token}" AND .username = "${username}"
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
                FILTER .token = "${token}"
            `);
            resolve(result);
        });
    }

    export async function updateUserToken(username : string, token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                UPDATE User
                FILTER .username = "${username}"
                SET {
                    token := "${token}",
                }
            `);
            resolve(result);
        });
    }

    export async function createUser(username : string, email : string, password : string, token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                insert User {
                    username := "${username}",
                    email := "${email}",
                    password := "${password}",
                    token := "${token}"
                }
            `);
            resolve(result);
        });
    }

    export async function checkCreateAccountUrlTokenByUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User_Creation {
                    username,
                    email,
                    password
                }
                FILTER .urlToken = "${urlToken}"
            `);
            resolve(result);
        });
    }

    export async function checkCreateAccountUrlTokenByEmail(email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User_Creation {
                    urlToken,
                    username,
                    password
                }
                FILTER .email = "${email}"
            `);
            resolve(result);
        });
    }

    export async function createCreateAccountUrlToken(urlToken : string, username : string, email : string, password : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                insert User_Creation {
                    urlToken := "${urlToken}",
                    username := "${username}",
                    email := "${email}",
                    password := "${password}"
                }
            `);
            resolve(result);
        });
    }

    export async function deleteCreateAccountUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                delete User_Creation
                    filter .urlToken = "${urlToken}";
            `);
            resolve(result);
        });
    }

    export async function checkResetPasswordUrlTokenByEmail(email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT Reset_Password {
                    urlToken,
                    username,
                    password
                }
                FILTER .email = "${email}"
            `);
            resolve(result);
        });
    }
    
    export async function checkResetPasswordUrlTokenByUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT Reset_Password {
                    username,
                    email,
                    password
                }
                FILTER .urlToken = "${urlToken}"
            `);
            resolve(result);
        });
    }

    export async function deleteResetPasswordUrlToken(email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                delete Reset_Password
                    filter .email = "${email}";
            `);
            resolve(result);
        });
    }

    export async function createResetPasswordUrlToken(urlToken : string, email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                insert Reset_Password {
                    urlToken := "${urlToken}",
                    email := "${email}"
                }
            `);
            resolve(result);
        });   
    }

    export async function resetPassword(email : string, password : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                UPDATE User
                FILTER .email = "${email}"
                SET {
                    password := "${password}",
                }
            `);
            resolve(result);
        });
    }
}