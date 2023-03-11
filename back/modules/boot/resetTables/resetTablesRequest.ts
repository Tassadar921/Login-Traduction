import { Client } from "edgedb";

module resetTablesRequest {
    export async function resetResetPassword(client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT Reset_Password {
                    urlToken
                };
            `);
            resolve(result);
        });
    }
    export async function resetUserCreation(client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User_Creation {
                    urlToken
                };
            `);
            resolve(result);
        });
    }
}

export default resetTablesRequest;