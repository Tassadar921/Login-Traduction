//----------------------------------------SignUp----------------------------------------
//Version 1.0.0 
//This class is used to manage the creation of the user's account
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import * as nodemailer from 'nodemailer';
import {Response} from 'express';
import {Client, createClient} from 'edgedb';
import accountSignInRequest from './accountSignUpRequest';
// @ts-ignore
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as crypto from 'node:crypto';
import regexRequest from 'modules/common/regex/regexRequest';

export class AccountSignUp {
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

    public async createUserCreation(username: string, password: string, email: string, language: string, res: Response): Promise<void> {
        if (!regexRequest.checkRegexEmail(email)) {
            res.json({status: -20});
            return;
        } else if (!regexRequest.checkRegexPassword(password)) {
            res.json({status: -21});
            return;
        } else if (!regexRequest.checkRegexUsername(username)) {
            res.json({status: -22});
            return;
        }

        let result = await accountSignInRequest.getUsernameAndEmailByUsernameAndEmail(username, email, this.client);
        if (result[0]) {
            if (result[0].username === username) {
                res.json({status: -40});
                return;
            } else {
                res.json({status: -41});
                return;
            }
        }

        result = await accountSignInRequest.getUrlTokenByEmail(email, this.client);
        if (result.length) {
            await accountSignInRequest.deleteUserCreationByUrlToken(result[0].urlToken, this.client);
        }

        let urlToken = this.generateToken(this.urlTokenLength);
        result = await accountSignInRequest.getUsernameAndEmailAndPasswordByUrlToken(urlToken, this.client);
        while (result.length > 0) {
            urlToken = this.generateToken(this.urlTokenLength);
            result = await accountSignInRequest.getUsernameAndEmailAndPasswordByUrlToken(urlToken, this.client);
        }

        await accountSignInRequest.createUserCreation(urlToken, username, email, await this.hashSha256(await this.hashSha256(password)), this.client);

        this.deleteUserCreation(urlToken);

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
    };

    //creates the account with datas in the queue linked to token
    public async createUser(urlToken: string, res: Response): Promise<void> {
        let resultInfosUser = Object(await accountSignInRequest.getUsernameAndEmailAndPasswordByUrlToken(urlToken, this.client));

        if (resultInfosUser.length > 0) {
            await accountSignInRequest.deleteUserCreationByUrlToken(urlToken, this.client);

            let token = this.generateToken(this.sessionTokenLength);
            let resultExistingSessionToken = await accountSignInRequest.getUsernameBySessionToken(token, this.client);
            while (resultExistingSessionToken.length > 0) {
                token = this.generateToken(this.sessionTokenLength);
                resultExistingSessionToken = await accountSignInRequest.getUsernameBySessionToken(token, this.client);
            }

            await accountSignInRequest.createUser(resultInfosUser[0].username, resultInfosUser[0].email, resultInfosUser[0].password, token, this.client);

            res.json({status: 1, sessionToken: token, username: resultInfosUser[0].username, permission: undefined});
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
    public deleteUserCreation(urlToken: string): void {
        const client = this.client;

        setTimeout(async () => {
            await accountSignInRequest.deleteUserCreationByUrlToken(urlToken, client);
        }, this.urlTokenExpiration);
        return;
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