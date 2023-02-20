import {Request, Response} from "express";
import {AccountFriends} from "./accountFriends";

module accountRouting {
    export function init(app: any): void {
        app.post('/fastCheck', async function (req: Request, res: Response) {
//            await AccountFriends.fastCheck(req.body.username, req.body.token, res);
        });

        console.log('Account routing initialized');
        return;
    }
}

export default accountRouting;