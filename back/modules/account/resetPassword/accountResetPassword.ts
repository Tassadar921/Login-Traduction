//----------------------------------------ResetPassword----------------------------------------
//Version 1.0.0 
//This class is used to manage the reset of the user's password
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//---------------------------------------------------------------------------------------------

import * as nodemailer from 'nodemailer';
import {Response} from 'express';
import {Client, createClient} from 'edgedb';
import accountResetPasswordRequest from './accountResetPasswordRequest';
// @ts-ignore
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as crypto from 'node:crypto';
import regexRequest from 'modules/common/regex/regexRequest';

export class AccountResetPassword {
    private readonly client: Client;
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    private readonly mailOptions: { from: string | undefined; to: string; subject: string; text: string; }
    private readonly urlTokenLength: number;
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
        this.urlTokenExpiration = parseInt(process.env.URL_TOKEN_EXPIRATION!);
    }

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    //temporary linking the token and email in the resetPassword queue
    public async mailResetPasswordCreateUrlToken(email: string, language: string, res: Response): Promise<void> {
        //check if the email is syntactically correct
        if (!regexRequest.checkRegexEmail(email)) {
            res.json({status: -2});
            return;
        }

        let result: any[] = await accountResetPasswordRequest.getUsernameByEmail(email, this.client);

        if (!result.length) {
            res.json({status: 0});
            return;
        } else {
            let username = result[0].username;

            result = await accountResetPasswordRequest.getUrlTokenByEmail(email, this.client);

            if (result.length) {
                await accountResetPasswordRequest.deleteResetPasswordByUrlToken(result[0].urlToken, this.client);
            }

            let urlToken = this.generateToken(this.urlTokenLength);
            result = await accountResetPasswordRequest.getEmailByUrlToken(urlToken, this.client);
            while (result.length) {
                urlToken = this.generateToken(this.urlTokenLength);
                result = await accountResetPasswordRequest.getEmailByUrlToken(urlToken, this.client);
            }

            await accountResetPasswordRequest.createResetPassword(urlToken, email, this.client);

            this.deleteResetPassword(urlToken);

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
            await accountResetPasswordRequest.getEmailByUrlToken(urlToken, this.client);

        if (result.length) {
            await accountResetPasswordRequest.deleteResetPasswordByUrlToken(urlToken, this.client);
            await accountResetPasswordRequest.resetPassword(
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

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    public deleteResetPassword(urlToken: string): void {
        const client = this.client;
        setTimeout(async () => {
                await accountResetPasswordRequest.deleteResetPasswordByUrlToken(urlToken, client)
            },
            this.urlTokenExpiration);
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