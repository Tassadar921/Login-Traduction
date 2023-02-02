import { Request, Response } from "express-serve-static-core";

export default accountRouting;

module accountRouting {
    export function init(app : any) {
        app.post('/userExists', function (req : Request, res : Response) {
            
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
    }
}