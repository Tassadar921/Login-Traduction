import { Client } from "edgedb";

module accountFriendsRequest {
    export async function newMessage(sender : string, receiver : string, message : string, date : Date, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                INSERT Message {
                    sender := (SELECT User FILTER .username = "${sender}" limit 1),
                    receiver := (SELECT User FILTER .username = "${receiver}"),
                    date := <datetime> "${date}",
                    text := "${message}"
                }
            `);
            resolve(result);
        });
    }
}

export default accountFriendsRequest;