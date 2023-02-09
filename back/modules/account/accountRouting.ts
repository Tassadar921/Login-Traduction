import { Request, Response } from "express";
import { Account } from "./account";

module accountRouting {
    export function init(app : any): void {
        const account = new Account();
        
        app.post('/mailCreateAccount', async function (req : Request, res : Response) {
            await account.mailCreateAccountCreateUrlToken(req.body.username, req.body.password, req.body.email, req.body.language, res);
        });
        app.post('/createAccount', async function (req : Request, res : Response) {
            await account.createAccount(req.body.urlToken, res);
        });
        app.post('/signIn', async function (req : Request, res : Response) {
            await account.signIn(req.body.identifier, req.body.password, res);
        });
        app.post('/mailResetPassword', async function (req : Request, res : Response) {
            await account.mailResetPasswordCreateUrlToken(req.body.email, req.body.language, res);
        });
        app.post('/resetPassword', async function (req : Request, res : Response) {
            await account.resetPassword(req.body.urlToken, req.body.password, res);
        });
        app.post('/fastCheck', async function (req : Request, res : Response) {
            await account.fastCheck(req.body.username, req.body.token, res);
        });

        console.log('Account routing initialized');
        return;
    }
}

export default accountRouting;