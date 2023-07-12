//----------------------------------------SignIn----------------------------------------
//Version 1.0.0 
//This class is used to manage the connection of the user
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 09/07/2023 - Iémélian RAMBEAU - Going from edgeDB to Prisma
//--------------------------------------------------------------------------------------

import { Response } from 'express';
import accountSignInRequest from './accountSignInRequest';
import regexRequest from '../../common/regex/regexRequest';
import { CommonAccount } from '../commonAccount';


export class AccountSignIn {
    private commonAccount = new CommonAccount();

    constructor() {
        this.commonAccount.sessionTokenLength = parseInt(process.env.SESSION_TOKEN_LENGTH!);
    }

    //signIn, identifier can be either username or email
    public async signIn(identifier: string, password: string, res: Response): Promise<void> {
        const result = await accountSignInRequest.getUsernameByPasswordAndIdentifier(identifier, await this.commonAccount.hashSha256(password));

        if (result == null) {
            res.json({ status: 0 });
            return;
        } else {
            let username: string = result.username;

            let sessionToken: string = this.commonAccount.generateToken(this.commonAccount.sessionTokenLength);
            let resultExistingSessionToken = await accountSignInRequest.checkSessionToken(sessionToken);
            while (resultExistingSessionToken != null) {
                sessionToken = this.commonAccount.generateToken(this.commonAccount.sessionTokenLength);
                resultExistingSessionToken = await accountSignInRequest.checkSessionToken(sessionToken);
            }

            await accountSignInRequest.updateUserToken(username, sessionToken);
            const resultPermissions = await accountSignInRequest.getPermissionByUsername(username);

            res.json({ status: 1, sessionToken, username, permission: resultPermissions });
            return;
        }
    }

    //delete the token of the user
    public async signOut(username: string, sessionToken: string, res: Response): Promise<void> {
        const result = await accountSignInRequest.getUserByTokenAndUsername(username, sessionToken);

        if (result == null) {
            res.json({ status: 0 });
            return;
        } else {
            await accountSignInRequest.updateUserToken(username, 'none');
            res.json({ status: 1 });
            return;
        }
    }

    //checks if the token is valid for the user
    public async checkSession(username: string, sessionToken: string): Promise<number> {
        if (!regexRequest.checkRegexUsername(username) || !regexRequest.checkRegexSessionToken(sessionToken, this.commonAccount.sessionTokenLength) || sessionToken == 'none') {
            return 0;
        }

        const result = await accountSignInRequest.getUserByTokenAndUsername(username, sessionToken);
        if (result) {
            return 1;
        } else {
            return 0;
        }
    }
}