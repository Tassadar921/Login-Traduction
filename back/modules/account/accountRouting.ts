import { Request, Response } from "express";
import { Account } from "./account";

module accountRouting {
    export function init(app : any): void {
        const account = new Account();
        
        app.post('/mailCreateAccount', function (req : Request, res : Response) {
            account.mailCreateAccountCreateUrlToken(req.body.username, req.body.password, req.body.email, req.body.language, res);
        });
        app.post('/createAccount', function (req : Request, res : Response) {
            account.createAccount(req.body.urlToken, res);
        });
        app.post('/signIn', function (req : Request, res : Response) {
            account.signIn(req.body.username, req.body.password, res);
        });
        app.post('/mailResetPassword', function (req : Request, res : Response) {
            account.mailResetPasswordCreateUrlToken(req.body.email, req.body.language, res);
        });
        app.post('/resetPassword', function (req : Request, res : Response) {
            account.resetPassword(req.body.urlToken, req.body.password, res);
        });
        app.post('/fastCheck', function (req : Request, res : Response) {
            account.fastCheck(req.body.username, req.body.token, res);
        });

        console.log('Account routing initialized');
        return;
    }
}

export default accountRouting;