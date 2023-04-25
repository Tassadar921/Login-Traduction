//----------------------------------------SignUp----------------------------------------
//Version 1.0.0 
//This class is used to manage the creation of the user's account
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import {Response} from 'express';
import accountSignInRequest from './accountSignUpRequest';
// @ts-ignore
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import regexRequest from 'modules/common/regex/regexRequest';
import {CommonAccount} from "../commonAccount";

export class AccountSignUp {
    private commonAccount = new CommonAccount();

    constructor() {}

    public async createUserCreation(
        username: string,
        password: string,
        email: string,
        language: string,
        res: Response): Promise<void> {
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

        let result = await accountSignInRequest.getUsernameAndEmailByUsernameAndEmail(
            username,
            email,
            this.commonAccount.client
        );
        if (result[0]) {
            if (result[0].username === username) {
                res.json({status: -40});
                return;
            } else {
                res.json({status: -41});
                return;
            }
        }

        result = await accountSignInRequest.getUrlTokenByEmail(
            email,
            this.commonAccount.client
        );
        if (result.length) {
            await accountSignInRequest.deleteUserCreationByUrlToken(
                result[0].urlToken,
                this.commonAccount.client
            );
        }

        let urlToken = this.commonAccount.generateToken(this.commonAccount.urlTokenLength);
        result = await accountSignInRequest.getUsernameAndEmailAndPasswordByUrlToken(
            urlToken,
            this.commonAccount.client
        );
        while (result.length > 0) {
            urlToken =
                this.commonAccount.generateToken(
                    this.commonAccount.urlTokenLength
                );
            result =
                await accountSignInRequest.getUsernameAndEmailAndPasswordByUrlToken(
                    urlToken,
                    this.commonAccount.client
                );
        }

        await accountSignInRequest.createUserCreation(
            urlToken,
            username,
            email,
            await this.commonAccount.hashSha256(
                await this.commonAccount.hashSha256(password)
            ),
            this.commonAccount.client
        );

        this.deleteUserCreation(urlToken);

        // @ts-ignore
        const languageFile =
            Object(await import('./files/json/languages/'
            + language + '/' + language + '_back.json',
                {assert: {type: 'json'}})).default;

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
                console.log(error);
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
        let resultInfosUser =
            Object(await accountSignInRequest.getUsernameAndEmailAndPasswordByUrlToken(
                urlToken,
                this.commonAccount.client
            ));

        if (resultInfosUser.length > 0) {
            await accountSignInRequest.deleteUserCreationByUrlToken(
                urlToken,
                this.commonAccount.client
            );

            let token = this.commonAccount.generateToken(this.commonAccount.sessionTokenLength);
            let resultExistingSessionToken =
                await accountSignInRequest.getUsernameBySessionToken(
                    token,
                    this.commonAccount.client
                );
            while (resultExistingSessionToken.length > 0) {
                token = this.commonAccount.generateToken(this.commonAccount.sessionTokenLength);
                resultExistingSessionToken =
                    await accountSignInRequest.getUsernameBySessionToken(
                        token,
                        this.commonAccount.client
                    );
            }

            await accountSignInRequest.createUser(
                resultInfosUser[0].username,
                resultInfosUser[0].email,
                resultInfosUser[0].password,
                token,
                this.commonAccount.client);

            res.json({
                status: 1,
                sessionToken: token,
                username: resultInfosUser[0].username,
                permission: undefined
            });
            return;
        } else {
            res.json({status: 0});
            return;
        }
    }

    //sends an email containing a unique token to create the account, effective for 10 minutes
    public deleteUserCreation(urlToken: string): void {
        const client = this.commonAccount.client;

        setTimeout(async () => {
            await accountSignInRequest.deleteUserCreationByUrlToken(urlToken, client);
        }, this.commonAccount.urlTokenExpiration);
        return;
    }
}