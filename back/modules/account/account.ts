import * as nodemailer from 'nodemailer';
import {Response} from 'express';
import {Client, createClient} from 'edgedb';
import {accountRequest} from './accountRequest';
// @ts-ignore
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as crypto from 'node:crypto';

export class Account {
    private readonly client: Client;
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    private readonly mailOptions: { from: string | undefined; to: string; subject: string; text: string; }
    private readonly urlTokenLength: number;
    private readonly tokenLength: number;

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
        this.tokenLength = parseInt(process.env.TOKEN_LENGTH!);
    }

    public async mailSignUp(username: string, password: string, email: string, language: string, res: Response) {
        if(!this.checkRegexEmail(email) || !this.checkRegexPassword(password) || !this.checkRegexUsername(username)){
            res.json({status: -2});
        }

        if (Object(await accountRequest.checkUser(username, email, this.client)).length > 0) {
            res.json({status: 0});
        }

        let result = await accountRequest.checkCreateAccountUrlTokenByEmail(email, this.client);
        if(result.length){
            await accountRequest.deleteCreateAccountUrlToken(email, this.client);
        }

        let urlToken = this.generateToken(this.urlTokenLength);
        result = await accountRequest.checkCreateAccountUrlTokenByUrlToken(urlToken, this.client);
        while (result.length > 0) {
            urlToken = this.generateToken(this.urlTokenLength);
            result = await accountRequest.checkCreateAccountUrlTokenByUrlToken(urlToken, this.client);
        }

        await accountRequest.createCreateAccountUrlToken(urlToken, username, email, await this.hashSha256(await this.hashSha256(password)), this.client);

        setTimeout(this.deleteCreateAccountQueueUrlToken, 600000, email);

        // @ts-ignore
        const languageFile = Object(await import('./files/json/languages/' + language + '/' + language + '_back.json', {assert: {type: 'json'}})).default;

        this.mailOptions.to = email;
        this.mailOptions.subject = languageFile.data.modules.account.mailCreateAccountCreateUrlToken.mailOptions.subject;
        this.mailOptions.text = languageFile.data.modules.account.mailCreateAccountCreateUrlToken.mailOptions.text.replace('<USERNAME>', username)
            + process.env.URL_FRONT
            + 'conf-account?urlToken='
            + urlToken;

        //sends an email containing a unique token to delete the account, effective for 10 minutes

        this.transporter.sendMail(this.mailOptions, async function (error) {
            if (error) {
                res.json({status: -1});
            } else {
                res.json({status: 1});
            }
        });
    };

    //creates the account with datas in the queue linked to token
    public async createAccount(urlToken: string, res: Response) {
        const result = await accountRequest.checkCreateAccountUrlTokenByUrlToken(urlToken, this.client);
        if (result.length > 0) {
            await accountRequest.deleteCreateAccountUrlToken(result[0].email, this.client);
            await accountRequest.createUser(result[0].username, result[0].email, result[0].password, 'none', this.client);
            res.json({status: 1});
        } else {
            res.json({status: 0});
        }
    }

    //signIn, identifier can be either username or email
    public async signIn(identifier : string, password : string, res : Response) {
        if((!this.checkRegexEmail(identifier) && !this.checkRegexUsername(identifier))){
            res.json({status: -1});
        }

        let result = await accountRequest.checkUserAndPassword(identifier, await this.hashSha256(password), this.client);

        if (!result.length) {
            res.json({status: 0});
        } else {
            let token = this.generateToken(this.tokenLength);
            let result1: any[] = await accountRequest.checkToken(token, this.client);
            while (result1.length > 0) {
                token = this.generateToken(this.tokenLength);
                result1 = await accountRequest.checkToken(token, this.client);
            }

            await accountRequest.updateUserToken(result[0].username, token, this.client);

            res.json({status: 1, token: token, username: result[0].username});
        }
    }

    //delete the token of the user
    public async signOut(username : string, token : string, res : Response) {
        let result: [{ username: string, email: string }] | any;

        result = await accountRequest.checkUserByToken(username, token, this.client);

        if (result.length == 0) {
            res.json({status: 0});
        } else if (result.length > 0) {
            await accountRequest.updateUserToken(username, 'none', this.client);

            res.json({status: 1});
        }
    }

    //checks if the token is valid for the user
    public async fastCheck(username : string, token : string, res : Response) {       
        const result: [{ username: string }] | any = await accountRequest.checkUserByToken(username, token, this.client);
        if (result.length == 1) {
            res.json({status: 1});
        } else {
            res.json({status: 0});
        }
    }

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    //temporary linking the token and email in the resetPassword queue
    public async mailResetPasswordCreateUrlToken(email: string, language: string, res: Response) {
        if(!this.checkRegexEmail(email)){
            res.json({status: -2});
        }

        const result0: any[] = await accountRequest.checkUser('', email, this.client);

        if (result0.length > 0) {
            res.json({status: 0});
        }

        let result2: any[] = await accountRequest.checkResetPasswordUrlTokenByEmail(email, this.client);

        switch (result2.length) {
            case 0:
                break;
            default:
                await accountRequest.deleteResetPasswordUrlToken(result2[0].urlToken, this.client);
                break;
        }

        let urlToken = this.generateToken(this.urlTokenLength);
        let result3: any[] = await accountRequest.checkResetPasswordUrlTokenByUrlToken(urlToken, this.client);
        while (result3.length > 0) {
            urlToken = this.generateToken(this.urlTokenLength);
            result3 = await accountRequest.checkResetPasswordUrlTokenByUrlToken(urlToken, this.client);
        }

        await accountRequest.createResetPasswordUrlToken(urlToken, email, this.client);

        console.log(urlToken)

        setTimeout(this.mailResetPasswordDeleteUrlToken, 600000, urlToken);

        // @ts-ignore
        const languageFile = await import('./files/json/languages/' + language + '/' + language + '_back.json', {assert: {type: 'json'}})

        this.mailOptions.to = email;
        this.mailOptions.subject = languageFile.mail[0].data;
        this.mailOptions.text = languageFile.mail[1].data.replace('username', result0[0].username)
            + process.env.URL_FRONT
            + 'conf-account?urlToken='
            + urlToken;

        //sends an email containing a unique token to delete the account, effective for 10 minutes

        this.transporter.sendMail(this.mailOptions, async function (error) {
            if (error) {
                res.json({status: -1});
            } else {
                res.json({status: 1});
            }
        });
    }

    //resets the password of the account linked to the email, himself linked to the token
    public async resetPassword(urlToken : string, password : string, res : Response) {
        const result: [{ username: string, email: string, password: string }] | any = await accountRequest.checkResetPasswordUrlTokenByUrlToken(urlToken, this.client);

        if (result.length > 0) {
            await accountRequest.deleteResetPasswordUrlToken(urlToken, this.client);
            await accountRequest.resetPassword(result[0].email, password, this.client);
            res.json({status: 1});
        } else {
            res.json({status: 0});
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
                }
                else {
                    reject("erreur random");
                }

            });

            hash.end();
        });
    }

    //sends an email containing a unique token to create the account, effective for 10 minutes
    private async deleteCreateAccountQueueUrlToken(email: string) {
        await accountRequest.deleteCreateAccountUrlToken(email, this.client);
    }

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    private async mailResetPasswordDeleteUrlToken(urlToken : string) {
        await accountRequest.deleteResetPasswordUrlToken(urlToken, this.client);
    }

    //checks if the username is valid
    private async checkRegexUsername(username : string) {
        if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(username)) {
            return true
        }
        return false
    }

    //checks if the email is valid
    private async checkRegexEmail(email : string) {
        if((/^[A-Z0-9+_.-]+@[A-Z0-9.-]+$/).test(email)) {
            return true
        }
        return false
    }

    //checks if the password is valid
    private async checkRegexPassword(password : string) {
        if(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]){8,}$/) {
            return true
        }
        return false
    }

    // generates token by stringing a random number of characters from a dictionnary
    private generateToken(length: number) {
        //edit the token allowed characters
        let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
        let token: string = '';
        for (let i = 0; i < length; i++) {
            let j = Math.floor(Math.random() * (alphabet.length - 1));
            token += alphabet[j];
        }
        console.log(token);
        return token;
    }
}