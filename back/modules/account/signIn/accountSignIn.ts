import {Response} from 'express';
import {Client, createClient} from 'edgedb';
import accountSignInRequest from './accountSignInRequest';
import * as crypto from 'node:crypto';
import regexRequest from '../../common/regex/regexRequest';


export class AccountSignIn {
    private readonly client: Client;
    private readonly sessionTokenLength: number;

    constructor() {
        this.client = createClient({});

        this.sessionTokenLength = parseInt(process.env.SESSION_TOKEN_LENGTH!);
    }

    //signIn, identifier can be either username or email
    public async signIn(identifier: string, password: string, res: Response): Promise<void> {

        const result = await accountSignInRequest.getPermissionByPasswordAndIdentifier(identifier, await this.hashSha256(password), this.client);

        if (!result.length) {
            res.json({status: 0});
            return;
        } else {
            let username = result[0].username;
            let token = this.generateToken(this.sessionTokenLength);
            let result1 = await accountSignInRequest.getUsernameBySessionToken(token, this.client);

            while (result1.length > 0) {
                token = this.generateToken(this.sessionTokenLength);
                result1 = await accountSignInRequest.getUsernameBySessionToken(token, this.client);
            }
            await accountSignInRequest.updateUserToken(username, token, this.client);
            const result2 = await accountSignInRequest.getPermissionByUsername(username, this.client);

            res.json({status: 1, sessionToken: token, username: username, permission: result2[0]?.permission});
            return;
        }
    }

    //delete the token of the user
    public async signOut(username: string, token: string, res: Response): Promise<void> {
        let result: [{ username: string, email: string }] | any;

        result = await accountSignInRequest.getPermissionByTokenAndUsername(username, token, this.client);

        if (result.length == 0) {
            res.json({status: 0});
            return;
        } else if (result.length > 0) {
            await accountSignInRequest.updateUserToken(username, 'none', this.client);
            res.json({status: 1});
            return;
        }
    }

        //checks if the token is valid for the user
        public async checkSession(username: string, sessionToken: string, res: Response): Promise<void> {
            if (!regexRequest.checkRegexUsername(username) || !regexRequest.checkRegexSessionToken(sessionToken)) {
                res.json({status: 0});
                return;
            }
    
            const result: [{ username: string }] | any = await accountSignInRequest.getPermissionByTokenAndUsername(username, sessionToken, this.client);
            if (result.length && sessionToken !== 'none') {
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