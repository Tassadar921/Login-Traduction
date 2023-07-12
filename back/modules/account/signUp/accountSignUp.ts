//----------------------------------------SignUp----------------------------------------
//Version 1.0.0 
//This class is used to manage the creation of the user's account
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 09/07/2023 - Iémélian RAMBEAU - Going from edgeDB to Prisma
//--------------------------------------------------------------------------------------

import { Response } from 'express';
import accountSignInRequest from './accountSignUpRequest';
import regexRequest from '../../common/regex/regexRequest';
import { CommonAccount } from "../commonAccount";
import logger from '../../common/logger/logger';

export class AccountSignUp {
    private commonAccount = new CommonAccount();

    constructor() { }

    public async createUserCreation(
        username: string,
        password: string,
        email: string,
        language: string,
        res: Response): Promise<void> {
        if (!regexRequest.checkRegexEmail(email)) {
            res.json({ status: -20 });
            return;
        } else if (!regexRequest.checkRegexPassword(password)) {
            res.json({ status: -21 });
            return;
        } else if (!regexRequest.checkRegexUsername(username)) {
            res.json({ status: -22 });
            return;
        }

        {
            let result = await accountSignInRequest.getUsernameAndEmailByUsernameAndEmail(
                username,
                email
            );
            if (result != undefined) {
                if (result.username === username) {
                    res.json({ status: -40 });
                    return;
                } else {
                    res.json({ status: -41 });
                    return;
                }
            }
        }

        await accountSignInRequest.deleteTokenByEmail(email);

        let urlToken: string = this.commonAccount.generateToken(this.commonAccount.urlTokenLength);
        let result = await accountSignInRequest.checkUrlToken(urlToken);
        while (result != null) {
            urlToken = this.commonAccount.generateToken(this.commonAccount.urlTokenLength);
            result = await accountSignInRequest.checkUrlToken(urlToken);
        }

        await accountSignInRequest.createUserInCreation(
            urlToken,
            username,
            email,
            await this.commonAccount.hashSha256(
                await this.commonAccount.hashSha256(password)
            )
        );

        this.deleteUserCreation(urlToken);

        const languageFile =
            Object(await import('./files/json/languages/'
                + language + '/' + language + '_back.json',
                { assert: { type: 'json' } })).default;

        this.commonAccount.mailOptions.to = email;
        this.commonAccount.mailOptions.subject =
            languageFile.data.modules.account
                .basic.mailCreateAccountCreateUrlToken.mailOptions.subject;
        this.commonAccount.mailOptions.text =
            languageFile.data.modules.account
                .basic.mailCreateAccountCreateUrlToken.mailOptions.text
                .replace('<USERNAME>', username)
            + process.env.URL_FRONT
            + '/conf-account?urlToken='
            + urlToken;

        //sends an email containing a unique token to delete the account, effective for 10 minutes

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
    };

    //creates the account with datas in the queue linked to token
    public async createUser(urlToken: string, res: Response): Promise<void> {

        let resultInfosUser = await accountSignInRequest.getUsernameAndEmailAndPasswordByUrlToken(urlToken);

        if (resultInfosUser != null) {
            await accountSignInRequest.deleteUserCreationByUrlToken(urlToken);

            let sessionToken: string = this.commonAccount.generateToken(this.commonAccount.sessionTokenLength);
            let resultExistingSessionToken = await accountSignInRequest.checkSessionToken(sessionToken);
            while (resultExistingSessionToken != null) {
                sessionToken = this.commonAccount.generateToken(this.commonAccount.sessionTokenLength);
                resultExistingSessionToken = await accountSignInRequest.checkSessionToken(sessionToken);
            }

            await accountSignInRequest.createUser(
                resultInfosUser.username,
                resultInfosUser.email,
                resultInfosUser.password,
                sessionToken);

            res.json({
                status: 1,
                sessionToken: sessionToken,
                username: resultInfosUser.username,
                permission: undefined
            });
            return;
        } else {
            res.json({ status: 0 });
            return;
        }
    }

    //sends an email containing a unique token to create the account, effective for 10 minutes
    public deleteUserCreation(urlToken: string): void {
        setTimeout(async () => {
            await accountSignInRequest.deleteTokenByToken(urlToken)
        }, this.commonAccount.urlTokenExpiration);
        return;
    }
}