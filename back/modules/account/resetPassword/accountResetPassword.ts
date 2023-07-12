//----------------------------------------ResetPassword----------------------------------------
//Version 1.0.0 
//This class is used to manage the reset of the user's password
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 09/07/2023 - Iémélian RAMBEAU - Going from edgeDB to Prisma
//---------------------------------------------------------------------------------------------

import { Response } from 'express';
import accountResetPasswordRequest from './accountResetPasswordRequest';
import regexRequest from '../../common/regex/regexRequest';
import { CommonAccount } from "../commonAccount";
import logger from '../../common/logger/logger';

export class AccountResetPassword {
    private commonAccount = new CommonAccount();

    constructor() { }

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    //temporary linking the token and email in the resetPassword queue
    public async mailResetPasswordCreateUrlToken(email: string, language: string, res: Response): Promise<void> {
        if (!regexRequest.checkRegexEmail(email)) {
            res.json({ status: -2 });
            return;
        }

        const resultUsername = await accountResetPasswordRequest.getUsernameByEmail(email);
        if (!resultUsername) {
            res.json({ status: 0 });
            return;
        } else {
            await accountResetPasswordRequest.deleteResetPasswordByEmail(email);

            let urlToken: string = this.commonAccount.generateToken(this.commonAccount.urlTokenLength);
            let result = await accountResetPasswordRequest.checkUrlToken(urlToken);
            while (result) {
                urlToken = this.commonAccount.generateToken(this.commonAccount.urlTokenLength);
                result = await accountResetPasswordRequest.checkUrlToken(urlToken);
            }

            await accountResetPasswordRequest.createResetPassword(urlToken, email);

            this.deleteResetPassword(urlToken);

            const languageFile = await import('./files/json/languages/'
                + language + '/' + language + '_back.json',
                { assert: { type: 'json' } });

            this.commonAccount.mailOptions.to = email;
            this.commonAccount.mailOptions.subject =
                languageFile.default.data.modules.account
                    .basic.mailResetPasswordCreateUrlToken.mailOptions.subject;
            this.commonAccount.mailOptions.text =
                languageFile.default.data.modules.account
                    .basic.mailResetPasswordCreateUrlToken.mailOptions.text
                    .replace('<USERNAME>', resultUsername.username)
                + process.env.URL_FRONT
                + '/reset-password?urlToken='
                + urlToken;

            //sends an email containing a unique token to reset the password, effective for process.env.URL_TOKEN_EXPIRATION

            this.commonAccount.transporter.sendMail(
                this.commonAccount.mailOptions,
                async function (error) {
                    if (error) {
                        logger.logger.error(error);
                        res.json({ status: -1 });
                        return;
                    } else {
                        res.json({ status: 1 });
                        return;
                    }
                });
        }
    }

    //resets the password of the account linked to the email, himself linked to the token
    public async resetPassword(urlToken: string, password: string, res: Response): Promise<void> {
        const result = await accountResetPasswordRequest.getEmailByUrlToken(urlToken);

        if (result) {
            await accountResetPasswordRequest.deleteResetPasswordByEmail(urlToken);
            await accountResetPasswordRequest.resetPassword(
                result.email,
                await this.commonAccount.hashSha256(await this.commonAccount.hashSha256(password)));
            res.json({ status: 1 });
            return;
        } else {
            res.json({ status: 0 });
            return;
        }
    }

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    public deleteResetPassword(urlToken: string): void {
        setTimeout(async () => {
            await accountResetPasswordRequest.deleteResetPasswordByUrlToken(urlToken)
        },
            this.commonAccount.urlTokenExpiration);
        return;
    }
}