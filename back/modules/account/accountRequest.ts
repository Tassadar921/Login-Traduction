// import { Client } from "edgedb";
//
// export module accountRequest {
//     export async function checkUser(username : string, email : string, client : Client) {
//         return await new Promise((resolve, reject) => {
//             client.query(`
//                 SELECT User {
//                     username,
//                     email,
//                 }
//                 FILTER .username = ${username} OR .email = ${email}
//             `);
//             if(error) reject({error, results});
//             resolve({error, results});
//         });
//     }
// }