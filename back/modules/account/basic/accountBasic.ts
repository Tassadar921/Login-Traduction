import * as nodemailer from 'nodemailer';
import {Response} from 'express';
import {Client, createClient} from 'edgedb';
import accountBasicRequest from './accountBasicRequest';
// @ts-ignore
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as crypto from 'node:crypto';

export class AccountBasic {
    private readonly client: Client;
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    private readonly mailOptions: { from: string | undefined; to: string; subject: string; text: string; }
    private readonly urlTokenLength: number;
    private readonly sessionTokenLength: number;
    private readonly urlTokenExpiration: number;

    constructor() {
        this.client = createClient({});

        //init of the mail sender
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        //mail options of subject, text and receiver
        this.mailOptions = {
            from: process.env.EMAIL,
            to: '',
            subject: '',
            text: ''
        };

        this.urlTokenLength = parseInt(process.env.URL_TOKEN_LENGTH!);
        this.sessionTokenLength = parseInt(process.env.SESSION_TOKEN_LENGTH!);
        this.urlTokenExpiration = parseInt(process.env.URL_TOKEN_EXPIRATION!);
    }

    public async mailSignUp(username: string, password: string, email: string, language: string, res: Response): Promise<void> {
        if (!this.checkRegexEmail(email)) {
            res.json({status: -20});
            return;
        } else if (!this.checkRegexPassword(password)) {
            res.json({status: -21});
            return;
        } else if (!this.checkRegexUsername(username)) {
            res.json({status: -22});
            return;
        } else {
            let result: any = Object(await accountBasicRequest.checkUser(username, email, this.client));
            if (result[0]) {
                if (result[0].username === username) {
                    res.json({status: -40});
                    return;
                } else {
                    res.json({status: -41});
                    return;
                }
            }

            result = await accountBasicRequest.checkCreateAccountUrlTokenByEmail(email, this.client);
            if (result.length) {
                await accountBasicRequest.deleteCreateAccountUrlToken(email, this.client);
            }

            let urlToken = this.generateToken(this.urlTokenLength);
            result = await accountBasicRequest.checkCreateAccountUrlTokenByUrlToken(urlToken, this.client);
            while (result.length > 0) {
                urlToken = this.generateToken(this.urlTokenLength);
                result = await accountBasicRequest.checkCreateAccountUrlTokenByUrlToken(urlToken, this.client);
            }

            await accountBasicRequest.createCreateAccountUrlToken(urlToken, username, email, await this.hashSha256(await this.hashSha256(password)), this.client);

            this.deleteCreateAccountQueueUrlToken(urlToken);

            // @ts-ignore
            const languageFile = Object(await import('./files/json/languages/' + language + '/' + language + '_back.json', {assert: {type: 'json'}})).default;

            this.mailOptions.to = email;
            this.mailOptions.subject = languageFile.data.modules.account.basic.mailCreateAccountCreateUrlToken.mailOptions.subject;
            this.mailOptions.text = languageFile.data.modules.account.basic.mailCreateAccountCreateUrlToken.mailOptions.text.replace('<USERNAME>', username)
                + process.env.URL_FRONT
                + '/conf-account?urlToken='
                + urlToken;

            //sends an email containing a unique token to delete the account, effective for 10 minutes

            this.transporter.sendMail(this.mailOptions, async function (error) {
                if (error) {
                    res.json({status: -1});
                    return;
                } else {
                    res.json({status: 1});
                    return;
                }
            });
        }
    };

    //creates the account with datas in the queue linked to token
    public async createAccount(urlToken: string, res: Response): Promise<void> {
        const result = await accountBasicRequest.checkCreateAccountUrlTokenByUrlToken(urlToken, this.client);
        if (result.length > 0) {
            await accountBasicRequest.deleteCreateAccountUrlToken(urlToken, this.client);

            let token = this.generateToken(this.sessionTokenLength);
            let result1: any[] = await accountBasicRequest.checkToken(token, this.client);
            while (result1.length > 0) {
                token = this.generateToken(this.sessionTokenLength);
                result1 = await accountBasicRequest.checkToken(token, this.client);
            }

            await accountBasicRequest.createUser(result[0].username, result[0].email, result[0].password, token, this.client);

            res.json({status: 1, token, username: result[0].username, permission: undefined});
            return;
        } else {
            res.json({status: 0});
            return;
        }
    }

    //signIn, identifier can be either username or email
    public async signIn(identifier: string, password: string, res: Response): Promise<void> {

        const result = await accountBasicRequest.checkUserAndPassword(identifier, await this.hashSha256(password), this.client);

        if (!result.length) {
            res.json({status: 0});
            return;
        } else {
            let username = result[0].username;
            let token = this.generateToken(this.sessionTokenLength);
            let result1 = await accountBasicRequest.checkToken(token, this.client);

            while (result1.length > 0) {
                token = this.generateToken(this.sessionTokenLength);
                result1 = await accountBasicRequest.checkToken(token, this.client);
            }
            await accountBasicRequest.updateUserToken(username, token, this.client);
            const result2 = await accountBasicRequest.checkPermission(username, this.client);

            res.json({status: 1, token, username: username, permission: result2[0]?.permission});
            return;
        }
    }

    //delete the token of the user
    public async signOut(username: string, token: string, res: Response): Promise<void> {
        let result: [{ username: string, email: string }] | any;

        result = await accountBasicRequest.checkUserByToken(username, token, this.client);

        if (result.length == 0) {
            res.json({status: 0});
            return;
        } else if (result.length > 0) {
            await accountBasicRequest.updateUserToken(username, 'none', this.client);
            res.json({status: 1});
            return;
        }
    }

    //checks if the token is valid for the user
    public async checkSession(username: string, sessionToken: string, res: Response): Promise<void> {
        if (!this.checkRegexUsername(username) || !this.checkRegexSessionToken(sessionToken)) {
            res.json({status: 0});
            return;
        }

        const result: [{ username: string }] | any = await accountBasicRequest.checkUserByToken(username, sessionToken, this.client);
        if (result.length && sessionToken !== 'none') {
            res.json({status: 1});
            return;
        } else {
            res.json({status: 0});
            return;
        }
    }

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    //temporary linking the token and email in the resetPassword queue
    public async mailResetPasswordCreateUrlToken(email: string, language: string, res: Response): Promise<void> {
        if (!this.checkRegexEmail(email)) {
            res.json({status: -2});
            return;
        }

        let result: any[] = await accountBasicRequest.checkUser('', email, this.client);

        if (!result.length) {
            res.json({status: 0});
            return;
        } else {
            let username = result[0].username;

            result = await accountBasicRequest.checkResetPasswordUrlTokenByEmail(email, this.client);

            if (result.length) {
                await accountBasicRequest.deleteResetPasswordUrlToken(result[0].urlToken, this.client);
            }

            let urlToken = this.generateToken(this.urlTokenLength);
            result = await accountBasicRequest.checkResetPasswordUrlTokenByUrlToken(urlToken, this.client);
            while (result.length) {
                urlToken = this.generateToken(this.urlTokenLength);
                result = await accountBasicRequest.checkResetPasswordUrlTokenByUrlToken(urlToken, this.client);
            }

            await accountBasicRequest.createResetPasswordUrlToken(urlToken, email, this.client);

            this.deleteMailResetPasswordQueueUrlToken(urlToken);

            // @ts-ignore
            const languageFile = await import('./files/json/languages/' + language + '/' + language + '_back.json', {assert: {type: 'json'}})

            this.mailOptions.to = email;
            this.mailOptions.subject =
                languageFile.default.data.modules.account.basic.mailResetPasswordCreateUrlToken.mailOptions.subject;
            this.mailOptions.text =
                languageFile.default.data.modules.account.basic.mailResetPasswordCreateUrlToken.mailOptions.text
                    .replace('<USERNAME>', username)
                + process.env.URL_FRONT
                + '/reset-password?urlToken='
                + urlToken;

            //sends an email containing a unique token to reset the password, effective for process.env.URL_TOKEN_EXPIRATION

            this.transporter.sendMail(this.mailOptions, async function (error) {
                if (error) {
                    res.json({status: -1});
                    return;
                } else {
                    res.json({status: 1});
                    return;
                }
            });
        }
    }

    //resets the password of the account linked to the email, himself linked to the token
    public async resetPassword(urlToken: string, password: string, res: Response): Promise<void> {
        const result: [{ email: string, password: string }] | any =
            await accountBasicRequest.checkResetPasswordUrlTokenByUrlToken(urlToken, this.client);

        if (result.length) {
            await accountBasicRequest.deleteResetPasswordUrlToken(urlToken, this.client);
            await accountBasicRequest.resetPassword(
                result[0].email,
                await this.hashSha256(await this.hashSha256(password)),
                this.client
            );
            res.json({status: 1});
            return;
        } else {
            res.json({status: 0});
            return;
        }
    }

    //hash a string with sha256
    private async hashSha256(data: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            hash.write(data);
            hash.on('readable', () => {
                const data = hash.read();
                if (data) {
                    const final = data.toString('hex');
                    resolve(final);
                } else {
                    reject('erreur random');
                }
            });
            hash.end();
        });
    }

    //sends an email containing a unique token to create the account, effective for 10 minutes
    public deleteCreateAccountQueueUrlToken(urlToken: string): void {
        const client = this.client;

        setTimeout(async () => {
            await accountBasicRequest.deleteCreateAccountUrlToken(urlToken, client);
        }, this.urlTokenExpiration);
        return;
    }

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    public deleteMailResetPasswordQueueUrlToken(urlToken: string): void {
        const client = this.client;
        setTimeout(async () => {
                await accountBasicRequest.deleteResetPasswordUrlToken(urlToken, client)
            },
            this.urlTokenExpiration);
        return;
    }

    //checks if the sessionToken
    private checkRegexSessionToken(sessionToken: string): boolean {
        const regex = new RegExp('^[A-Za-z0-9]{' + this.sessionTokenLength + '}$');
        return (regex).test(sessionToken);
    }

    //checks if the urlToken is valid
    private checkRegexUrlToken(urlToken: string): boolean {
        const regex = new RegExp('/^[A-Za-z0-9]{' + this.urlTokenLength + '}$/');

        return (regex).test(urlToken);
    }

    //checks if the username is valid
    private checkRegexUsername(username: string): boolean {
        return (/^[A-Za-zÀ-ÖØ-öø-ÿ0-9_\-]{3,20}$/).test(username);
    }

    //checks if the email is valid
    private checkRegexEmail(email: string): boolean {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email);
    }

    //checks if the password is valid
    private checkRegexPassword(password: string): boolean {
        return (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&\.\-_])[A-Za-z\d@$!%*?&\.\-_]{8,}$/).test(password);
    }

    // generates token by stringing a random number of characters from a dictionary
    private generateToken(length: number): string {
        //edit the token allowed characters
        let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
        let token: string = '';
        for (let i = 0; i < length; i++) {
            let j = Math.floor(Math.random() * (alphabet.length - 1));
            token += alphabet[j];
        }
        return token;
    }
}