import { Request, Response } from "express";
import { Account } from "./account";

module accountRouting {
    export function init(app : any): void {
        const account = new Account();

        app.post('/userExists', function (req : Request, res : Response) {
            account.userExists(req.body.username, req.body.email, res);
        });
        app.post('/mailCreateAccount', function (req : Request, res : Response) {
            
        });
        app.post('/checkSignUpToken', function (req : Request, res : Response) {

        });
        app.post('/createAccount', function (req : Request, res : Response) {

        });
        app.post('/signIn', function (req : Request, res : Response) {

        });
        app.post('/mailResetPassword', function (req : Request, res : Response) {

        });
        app.post('/checkResetPasswordToken', function (req : Request, res : Response) {

        });
        app.post('/resetPassword', function (req : Request, res : Response) {

        });

        console.log('Account routing initialized');
        return;
    }
}

export default accountRouting;