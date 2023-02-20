import {Request, Response} from "express";
import {AccountBasic} from "./basic/accountBasic";
import EncryptRsa from "encrypt-rsa";

module accountRouting {
    export function init(app: any): void {
        const account = new AccountBasic();
        const encryptRsa = new EncryptRsa();
        const {publicKey, privateKey} = encryptRsa.createPrivateAndPublicKeys();

        function decrypt(encryptedText: string) {
            return encryptRsa.decryptStringWithRsaPrivateKey({
                text: encryptedText,
                privateKey
            });
        }

        app.get('/getPublicKey', async function (req: Request, res: Response) {
            await res.json({publicKey});
        });
        app.post('/mailSignUp', async function (req: Request, res: Response) {
            await account.mailSignUp(req.body.username, decrypt(req.body.password), req.body.email, req.body.language, res);
        });
        app.post('/createAccount', async function (req: Request, res: Response) {
            await account.createAccount(req.body.urlToken, res);
        });
        app.post('/signIn', async function (req: Request, res: Response) {
            await account.signIn(req.body.identifier, req.body.password, res);
        });
        app.post('/mailResetPassword', async function (req: Request, res: Response) {
            await account.mailResetPasswordCreateUrlToken(req.body.email, req.body.language, res);
        });
        app.post('/resetPassword', async function (req: Request, res: Response) {
            await account.resetPassword(req.body.urlToken, req.body.password, res);
        });
        app.post('/fastCheck', async function (req: Request, res: Response) {
            await account.fastCheck(req.body.username, req.body.token, res);
        });

        console.log('Account routing initialized');
        return;
    }
}

export default accountRouting;