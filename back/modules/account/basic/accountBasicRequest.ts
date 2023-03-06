import { Client } from "edgedb";

module accountBasicRequest {
    export async function checkUser(username : string, email : string, client : Client) {
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

    export async function checkUserAndPassword(identifier : string, password : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User {
                    username,
                    email,
                }
                FILTER ( .email = "${identifier}" OR .username = "${identifier}") AND .password = "${password}"
            `));
        });
    }

    export async function checkUserByToken(username : string, token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User {
                    username,
                }
                FILTER .token = "${token}" AND .username = "${username}"
            `));
        });
    }

    export async function checkToken(token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User {
                    password,
                }
                FILTER .token = "${token}"
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

    export async function checkCreateAccountUrlTokenByUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User_Creation {
                    username,
                    email,
                    password
                }
                FILTER .urlToken = "${urlToken}"
            `));
        });
    }

    export async function checkCreateAccountUrlTokenByEmail(email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT User_Creation {
                    urlToken,
                    username,
                    password
                }
                FILTER .email = "${email}"
            `));
        });
    }

    export async function createCreateAccountUrlToken(urlToken : string, username : string, email : string, password : string, client : Client) {
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

    export async function deleteCreateAccountUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                delete User_Creation
                    filter .urlToken = "${urlToken}";
            `));
        });
    }

    export async function checkResetPasswordUrlTokenByEmail(email : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT Reset_Password {
                    urlToken
                }
                FILTER .email = "${email}"
            `));
        });
    }
    
    export async function checkResetPasswordUrlTokenByUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT Reset_Password {
                    email
                }
                FILTER .urlToken = "${urlToken}"
            `));
        });
    }

    export async function deleteResetPasswordUrlToken(urlToken : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                delete Reset_Password
                    filter .urlToken = "${urlToken}";
            `));
        });
    }

    export async function createResetPasswordUrlToken(urlToken : string, email : string, client : Client) {
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

export default accountBasicRequest;