//----------------------------------------ResetPassword----------------------------------------
//Version 1.0.0 
//This class is used to manage the reset of the user's password
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//---------------------------------------------------------------------------------------------

import {Response} from 'express';
import accountResetPasswordRequest from './accountResetPasswordRequest';
import regexRequest from 'modules/common/regex/regexRequest';
import {CommonAccount} from "../commonAccount";
import { Client } from "edgedb";

export class AccountResetPassword {
    private commonAccount = new CommonAccount();

    constructor() {}

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    //temporary linking the token and email in the resetPassword queue
    public async mailResetPasswordCreateUrlToken(email: string, language: string, res: Response): Promise<void> {
        if (!regexRequest.checkRegexEmail(email)) {
            res.json({status: -2});
            return;
        }

        let result: any[] = await accountResetPasswordRequest.getUsernameByEmail(
            email, 
            this.commonAccount.client
        );

        if (!result.length) {
            res.json({status: 0});
            return;
        } else {
            let username : string = result[0].username;

            result = await accountResetPasswordRequest.getUrlTokenByEmail(
                email, 
                this.commonAccount.client
            );

            if (result.length) {
                await accountResetPasswordRequest.deleteResetPasswordByUrlToken(
                    result[0].urlToken,
                    this.commonAccount.client
                );
            }

            let urlToken : string = this.commonAccount.generateToken(
                this.commonAccount.urlTokenLength
            );
            result = await accountResetPasswordRequest.getEmailByUrlToken(
                urlToken,
                this.commonAccount.client
            );
            while (result.length) {
                urlToken = this.commonAccount.generateToken(
                    this.commonAccount.urlTokenLength
                );
                result = await accountResetPasswordRequest.getEmailByUrlToken(
                    urlToken,
                    this.commonAccount.client
                );
            }

            await accountResetPasswordRequest.createResetPassword(
                urlToken,
                email,
                this.commonAccount.client
            );

            this.deleteResetPassword(urlToken);

            const languageFile = await import('./files/json/languages/'
            + language + '/' + language + '_back.json',
                {assert: {type: 'json'}});

            this.commonAccount.mailOptions.to = email;
            this.commonAccount.mailOptions.subject =
                languageFile.default.data.modules.account
                    .basic.mailResetPasswordCreateUrlToken.mailOptions.subject;
            this.commonAccount.mailOptions.text =
                languageFile.default.data.modules.account
                    .basic.mailResetPasswordCreateUrlToken.mailOptions.text
                    .replace('<USERNAME>', username)
                + process.env.URL_FRONT
                + '/reset-password?urlToken='
                + urlToken;

            //sends an email containing a unique token to reset the password, effective for process.env.URL_TOKEN_EXPIRATION

            this.commonAccount.transporter.sendMail(
                this.commonAccount.mailOptions,
                async function (error) {
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
        const result : any[] =
            await accountResetPasswordRequest.getEmailByUrlToken(
                urlToken,
                this.commonAccount.client
            );

        if (result.length) {
            await accountResetPasswordRequest.deleteResetPasswordByUrlToken(
                urlToken,
                this.commonAccount.client
            );
            await accountResetPasswordRequest.resetPassword(
                result[0].email,
                await this.commonAccount.hashSha256(
                    await this.commonAccount.hashSha256(password)
                ),
                this.commonAccount.client
            );
            res.json({status: 1});
            return;
        } else {
            res.json({status: 0});
            return;
        }
    }

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    public deleteResetPassword(urlToken: string): void {
        const client : Client = this.commonAccount.client;
        setTimeout(async () => {
                console.log('deleteResetPassword setTimeout');
                await accountResetPasswordRequest.deleteResetPasswordByUrlToken(
                    urlToken,
                    client
                )
            },
            this.commonAccount.urlTokenExpiration);
        return;
    }
}